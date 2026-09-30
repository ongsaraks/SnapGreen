import os
import io
import time
import base64
import requests
from PIL import Image
from dotenv import load_dotenv
try:
    from services.trash_config import get_class_info
except ModuleNotFoundError:
    from trash_config import get_class_info

# Load environment variables
load_dotenv()

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
ROBOFLOW_MODEL_ID = os.getenv("ROBOFLOW_MODEL_ID")
ROBOFLOW_MODEL_VERSION = os.getenv("ROBOFLOW_MODEL_VERSION")
ROBOFLOW_CONFIDENCE_THRESHOLD = float(os.getenv("ROBOFLOW_CONFIDENCE"))
ROBOFLOW_TIMEOUT = int(os.getenv("ROBOFLOW_TIMEOUT"))
ROBOFLOW_API_URL = os.getenv("ROBOFLOW_API_URL")

INFERENCE_URL = f"{ROBOFLOW_API_URL.rstrip('/')}/{ROBOFLOW_MODEL_ID}/{ROBOFLOW_MODEL_VERSION}"


def warmup_roboflow():
    """
    Sends a lightweight dummy image to wake up the Roboflow Serverless container
    in the background, preventing cold-start timeouts on the first user scan.
    """
    try:
        dummy = Image.new("RGB", (64, 64), color=(128, 128, 128))
        buf = io.BytesIO()
        dummy.save(buf, format="JPEG", quality=50)
        b64_dummy = base64.b64encode(buf.getvalue()).decode("ascii")

        print("[Roboflow] Warming up serverless container...")
        res = requests.post(
            INFERENCE_URL,
            params={"api_key": ROBOFLOW_API_KEY, "confidence": 50},
            data=b64_dummy,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=30
        )
        print(f"[Roboflow Warmup] Status: {res.status_code}")
    except Exception as e:
        print(f"[Roboflow Warmup Notice] {e}")


def run_roboflow_detection(image_bytes: bytes, confidence_threshold: float = ROBOFLOW_CONFIDENCE_THRESHOLD):
    """
    Submits image to Roboflow Hosted Inference API.
    Pre-processes large images to 640px (native YOLO resolution) to optimize
    network payload, accelerate inference, and prevent read timeouts.
    Returns parsed predictions, image metadata, and total points.
    """
    # Open image with PIL to verify and get dimensions
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    orig_width, orig_height = image.size

    # Downscale image to native YOLO resolution (640x640)
    # Sending >640px creates 10x larger payloads causing upload stalls & 35s+ read timeouts
    MAX_INFER_DIM = 640
    infer_image = image.copy()
    if max(orig_width, orig_height) > MAX_INFER_DIM:
        resample_filter = getattr(Image, "Resampling", Image).LANCZOS
        infer_image.thumbnail((MAX_INFER_DIM, MAX_INFER_DIM), resample_filter)

    infer_width, infer_height = infer_image.size

    # Convert optimized image to base64 for Roboflow API (quality=75 produces ~30-50KB payload)
    buffered = io.BytesIO()
    infer_image.save(buffered, format="JPEG", quality=75)
    b64_image = base64.b64encode(buffered.getvalue()).decode("ascii")

    # Call Roboflow Inference API
    params = {
        "api_key": ROBOFLOW_API_KEY,
        "confidence": int(confidence_threshold * 100),
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    res_data = None
    last_error = None
    retries = 2

    for attempt in range(1, retries + 1):
        try:
            response = requests.post(
                INFERENCE_URL,
                params=params,
                data=b64_image,
                headers=headers,
                timeout=ROBOFLOW_TIMEOUT
            )
            response.raise_for_status()
            res_data = response.json()
            break
        except (requests.exceptions.Timeout, requests.exceptions.RequestException) as e:
            last_error = e
            print(f"[Roboflow Warning] Attempt {attempt}/{retries} failed: {e}")
            if attempt < retries:
                time.sleep(1.0)

    if res_data is None:
        print(f"[Roboflow Error] All attempts failed: {last_error}")
        return {
            "success": False,
            "error": str(last_error),
            "predictions": [],
            "image_dimensions": {"width": orig_width, "height": orig_height},
            "total_items": 0,
            "total_credits": 0,
        }

    raw_predictions = res_data.get("predictions", [])
    img_info = res_data.get("image", {"width": infer_width, "height": infer_height})
    img_w = float(img_info.get("width", infer_width))
    img_h = float(img_info.get("height", infer_height))

    scale_x = orig_width / img_w if img_w > 0 else 1.0
    scale_y = orig_height / img_h if img_h > 0 else 1.0

    parsed_items = []
    total_credits = 0

    for idx, pred in enumerate(raw_predictions):
        raw_class = pred.get("class", "trash")
        conf = float(pred.get("confidence", 0.0))
        
        # Center coordinates to Box (x1, y1, width, height) relative to infer_image
        cx = float(pred.get("x", 0))
        cy = float(pred.get("y", 0))
        bw = float(pred.get("width", 0))
        bh = float(pred.get("height", 0))

        x1 = max(0.0, cx - (bw / 2.0))
        y1 = max(0.0, cy - (bh / 2.0))

        # Relative percentage for responsive overlay rendering in frontend
        left_pct = round((x1 / img_w) * 100, 2)
        top_pct = round((y1 / img_h) * 100, 2)
        width_pct = round((bw / img_w) * 100, 2)
        height_pct = round((bh / img_h) * 100, 2)

        # Scale pixel coords back to original image size
        orig_x1 = x1 * scale_x
        orig_y1 = y1 * scale_y
        orig_bw = bw * scale_x
        orig_bh = bh * scale_y

        # Get bin information and color styling
        class_meta = get_class_info(raw_class)
        points = class_meta.get("points", 15)
        total_credits += points

        parsed_items.append({
            "id": f"det_{idx}_{raw_class}",
            "raw_class": raw_class,
            "thai_name": class_meta["thai_name"],
            "bin_id": class_meta["bin_id"],
            "bin_name": class_meta["bin_name"],
            "bin_type": class_meta["bin_type"],
            "bin_color": class_meta["bin_color"],
            "box_color": class_meta["box_color"],
            "badge_bg": class_meta["badge_bg"],
            "badge_text": class_meta["badge_text"],
            "confidence": round(conf, 3),
            "points": points,
            "bounding_box": {
                "x1": round(orig_x1, 1),
                "y1": round(orig_y1, 1),
                "width": round(orig_bw, 1),
                "height": round(orig_bh, 1),
                "left_pct": left_pct,
                "top_pct": top_pct,
                "width_pct": width_pct,
                "height_pct": height_pct,
            }
        })

    return {
        "success": True,
        "predictions": parsed_items,
        "image_dimensions": {"width": orig_width, "height": orig_height},
        "total_items": len(parsed_items),
        "total_credits": total_credits,
    }
