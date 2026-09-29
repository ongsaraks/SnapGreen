"""
=============================================================================
SNAPGREEN TRASH & BIN CONFIGURATION (VERSION 3)
=============================================================================
HOW TO CUSTOMIZE:
1. To move an item to another bin (e.g. move Plastic_Bottle to Blue bin):
   - Simply cut 'Plastic_Bottle' from the "classes" list of YELLOW_BIN and paste
     it into the "classes" list of BLUE_BIN below.
2. To add a new Roboflow class:
   - Add the exact class name from Roboflow to the desired bin's "classes" list.
   - Add its Thai translation into CLASS_THAI_NAMES.
   - (Optional) Set a custom badge/border color in CLASS_STYLE_OVERRIDES.
=============================================================================
"""

# ---------------------------------------------------------------------------
# 1. TRASH BIN SETS (Categories)
# Define each bin as a set of classes. Easily move classes between bins here!
# ---------------------------------------------------------------------------
BIN_SETS = {
    "BLUE_BIN": {
        "bin_id": "blue",
        "bin_name": "ถังสีน้ำเงิน",
        "bin_type": "ขยะทั่วไป (General Waste)",
        "color_hex": "#2563eb",
        "badge_bg": "#1d4ed8",
        "badge_text": "#ffffff",
        "points_per_item": 15,
        "classes": [
            "Snack_Wrapper",        # ถุงขนม
            "Plastic_Bag",          # ถุงพลาสติก
            "Plastic film",         # ฟิล์มพลาสติก / พลาสติกห่อ
            "Plastic straw",        # หลอดพลาสติก
            "Plastic utensils",     # ช้อนส้อมพลาสติก
            "Foam food container",  # กล่องโฟมใส่อาหาร
            "Paper cup",            # แก้วกระดาษ (เปื้อนสารเคลือบ)
            "Sauce_Packet",         # ซองซอส
            "Face_Mask",            # หน้ากากอนามัย
            "Aluminium Foil",       # ฟอยล์อลูมิเนียมเปื้อนเศษอาหาร
        ]
    },
    "YELLOW_BIN": {
        "bin_id": "yellow",
        "bin_name": "ถังสีเหลือง",
        "bin_type": "ขยะรีไซเคิล (Recycle)",
        "color_hex": "#eab308",
        "badge_bg": "#ca8a04",
        "badge_text": "#ffffff",
        "points_per_item": 15,
        "classes": [
            "Plastic_Bottle",       # ขวดพลาสติกใส
            "Plastic_Cup",          # แก้วพลาสติก
            "Plastic_Food_Container", # กล่องพลาสติกใส่อาหาร
            "Plastic bottle cap",   # ฝาขวดพลาสติก
            "METAL",                # กระป๋องโลหะ
            "Glass",                # ขวดแก้ว
            "Cardboard_Box",        # กล่องกระดาษ / ลัง
            "Paper Bag",            # ถุงกระดาษ
            "paper",                # เศษกระดาษสะอาด
            "Drink carton",         # กล่องเครื่องดื่ม UHT
        ]
    },
    "GREEN_BIN": {
        "bin_id": "green",
        "bin_name": "ถังสีเขียว",
        "bin_type": "ขยะอินทรีย์ / เศษอาหาร (Organic Waste)",
        "color_hex": "#22c55e",
        "badge_bg": "#16a34a",
        "badge_text": "#ffffff",
        "points_per_item": 15,
        "classes": [
            "Food_Scraps",          # เศษอาหาร / ผักผลไม้
        ]
    },
    "ORANGE_BIN": {
        "bin_id": "orange",
        "bin_name": "ถังสีส้ม / สีแดง",
        "bin_type": "ขยะอันตราย (Hazardous Waste)",
        "color_hex": "#f97316",
        "badge_bg": "#ea580c",
        "badge_text": "#ffffff",
        "points_per_item": 15,
        "classes": [
            "Battery",              # แบตเตอรี่ / ถ่านไฟฉาย
        ]
    }
}

# ---------------------------------------------------------------------------
# 2. THAI TRANSLATIONS FOR ROBOFLOW CLASSES
# Edit the display text shown to students in the app here.
# ---------------------------------------------------------------------------
CLASS_THAI_NAMES = {
    "Aluminium Foil": "ฟอยล์อลูมิเนียม",
    "Battery": "แบตเตอรี่ / ถ่าน",
    "Cardboard_Box": "กล่องกระดาษ",
    "Drink carton": "กล่องเครื่องดื่ม UHT",
    "Face_Mask": "หน้ากากอนามัย",
    "Foam food container": "กล่องโฟม",
    "Food_Scraps": "เศษอาหาร",
    "Glass": "ขวดแก้ว",
    "METAL": "กระป๋อง",
    "Paper Bag": "ถุงกระดาษ",
    "Paper cup": "แก้วกระดาษ",
    "Plastic bottle cap": "ฝาขวดพลาสติก",
    "Plastic film": "ฟิล์มพลาสติก",
    "Plastic straw": "หลอดพลาสติก",
    "Plastic utensils": "ช้อนส้อมพลาสติก",
    "Plastic_Bag": "ถุงพลาสติก",
    "Plastic_Bottle": "ขวดพลาสติก",
    "Plastic_Cup": "แก้วพลาสติก",
    "Plastic_Food_Container": "กล่องพลาสติกใส่อาหาร",
    "Sauce_Packet": "ซองซอส",
    "Snack_Wrapper": "ถุงขนม",
    "paper": "กระดาษ",
}

# ---------------------------------------------------------------------------
# 3. INDIVIDUAL CLASS STYLING OVERRIDES (Optional)
# If you want a specific item to have unique badge/box styling matching Figma
# (e.g. Snack_Wrapper has a red box/badge, METAL has a warm taupe/brown box).
# If not specified here, it automatically uses the parent bin's theme!
# ---------------------------------------------------------------------------
CLASS_STYLE_OVERRIDES = {
    "Snack_Wrapper": {
        "box_color": "#ef4444",      # Red bounding box (matches Figma)
        "badge_bg": "#dc2626",       # Red header tab
        "badge_text": "#ffffff",
    },
    "Plastic_Bag": {
        "box_color": "#f87171",
        "badge_bg": "#ef4444",
        "badge_text": "#ffffff",
    },
    "METAL": {
        "box_color": "#b45309",      # Warm amber/brown bounding box (matches Figma)
        "badge_bg": "#92400e",       # Warm brown header tab
        "badge_text": "#ffffff",
    },
    "Plastic_Bottle": {
        "box_color": "#0284c7",
        "badge_bg": "#0369a1",
        "badge_text": "#ffffff",
    }
}


def get_bin_for_class(class_name: str):
    """
    Looks up which bin category a detected class belongs to.
    Defaults to BLUE_BIN (General Waste) if not found.
    """
    for key, bin_info in BIN_SETS.items():
        if class_name in bin_info["classes"]:
            return bin_info
    return BIN_SETS["BLUE_BIN"]


def get_class_info(class_name: str):
    """
    Returns full metadata for a given class: Thai label, bin information, and styling.
    """
    bin_info = get_bin_for_class(class_name)
    thai_name = CLASS_THAI_NAMES.get(class_name, class_name)
    override = CLASS_STYLE_OVERRIDES.get(class_name, {})

    box_color = override.get("box_color", bin_info["color_hex"])
    badge_bg = override.get("badge_bg", bin_info["badge_bg"])
    badge_text = override.get("badge_text", bin_info["badge_text"])

    return {
        "raw_class": class_name,
        "thai_name": thai_name,
        "bin_id": bin_info["bin_id"],
        "bin_name": bin_info["bin_name"],
        "bin_type": bin_info["bin_type"],
        "bin_color": bin_info["color_hex"],
        "box_color": box_color,
        "badge_bg": badge_bg,
        "badge_text": badge_text,
        "points": bin_info.get("points_per_item", 15),
    }
