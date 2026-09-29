import imagehash
from PIL import Image
import io

def compute_hash(image_bytes: bytes) -> str:
    """
    Computes a perceptual hash (pHash) for duplicate photo anti-farming protection.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return str(imagehash.phash(img))

def is_duplicate(new_hash_str: str, existing_hash_strs: list[str], threshold: int = 5) -> bool:
    """
    Compares the new hash against a list of existing hashes within Hamming distance threshold.
    """
    if not new_hash_str or not existing_hash_strs:
        return False
    try:
        new_hash = imagehash.hex_to_hash(new_hash_str)
        for existing_str in existing_hash_strs:
            if not existing_str:
                continue
            existing_hash = imagehash.hex_to_hash(existing_str)
            if new_hash - existing_hash <= threshold:
                return True
    except Exception:
        pass
    return False
