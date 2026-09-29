import os
import json
import uuid
from datetime import datetime
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
import threading

from database import models, db
from services.roboflow_service import run_roboflow_detection, warmup_roboflow
from utils.image_hash import compute_hash, is_duplicate

# Create database tables if they do not exist
models.Base.metadata.create_all(bind=db.engine)

app = FastAPI(
    title="MUICT SnapGreen V3 API",
    description="Backend API for SnapGreen trash classification, rewards, and faculty green space.",
    version="3.0.0"
)

@app.on_event("startup")
def startup_event():
    # Warm up Roboflow serverless container in background on startup
    threading.Thread(target=warmup_roboflow, daemon=True).start()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    student_id: str = Field(..., min_length=1, max_length=64)

class ClaimPointsRequest(BaseModel):
    student_id: str
    image_hash: Optional[str] = None
    items: List[dict]
    total_credits: int
    location: Optional[str] = "อาคาร ICT ชั้น 1"

class RedeemRequest(BaseModel):
    student_id: str
    prize_id: str
    prize_name: str
    credits_cost: int

# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------
def get_or_create_faculty_stats(session: Session) -> models.FacultyStats:
    stats = session.query(models.FacultyStats).filter(models.FacultyStats.id == 1).first()
    if not stats:
        stats = models.FacultyStats(id=1, total_scans=16, trees_planted=5, next_tree_goal=28)
        session.add(stats)
        session.commit()
        session.refresh(stats)
    return stats

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "app": "MUICT SnapGreen V3",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    """Health check endpoint for Docker, K8s, and cloud orchestrators."""
    return {"status": "healthy"}

@app.get("/api/warmup")
def warmup():
    """Triggers background wakeup of Roboflow inference container."""
    threading.Thread(target=warmup_roboflow, daemon=True).start()
    return {"status": "ok", "message": "Roboflow warmup initiated"}

@app.post("/api/login")
def login(request: LoginRequest, session: Session = Depends(db.get_db)):
    """Logs in or registers student by Student ID."""
    clean_id = request.student_id.strip()
    user = session.query(models.User).filter(models.User.student_id == clean_id).first()
    if not user:
        # Default starting stats matching Figma mockup (155 pt, 16 scans) or 0
        user = models.User(student_id=clean_id, credits=155, total_scanned=16)
        session.add(user)
        session.commit()
        session.refresh(user)
    return {
        "id": user.id,
        "student_id": user.student_id,
        "credits": user.credits,
        "total_scanned": user.total_scanned
    }

@app.get("/api/user/{student_id}")
def get_user(student_id: str, session: Session = Depends(db.get_db)):
    """Fetches user profile and points."""
    user = session.query(models.User).filter(models.User.student_id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")
    return {
        "id": user.id,
        "student_id": user.student_id,
        "credits": user.credits,
        "total_scanned": user.total_scanned
    }

@app.get("/api/stats")
def get_faculty_stats(session: Session = Depends(db.get_db)):
    """Returns faculty total scans, trees planted, and next goal."""
    stats = get_or_create_faculty_stats(session)
    return {
        "total_scans": stats.total_scans,
        "trees_planted": stats.trees_planted,
        "next_tree_goal": stats.next_tree_goal
    }

@app.post("/api/detect")
async def detect_trash(
    file: UploadFile = File(...),
    student_id: Optional[str] = Form(None),
    session: Session = Depends(db.get_db)
):
    """
    STEP 1 OF SCAN FLOW:
    Uploads photo, checks for duplicate image, sends to Roboflow, and returns
    bounding boxes + detected item breakdown.
    Does NOT commit points to student yet (waiting for user to tap 'รับแต้ม').
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file received.")

    # 1. Compute perceptual hash
    img_hash = compute_hash(image_bytes)

    # 2. Check duplicate for student (last 50 scans)
    is_dup = False
    if student_id:
        recent_logs = session.query(models.ClassificationLog.image_hash)\
            .filter(models.ClassificationLog.student_id == student_id)\
            .order_by(models.ClassificationLog.timestamp.desc()).limit(50).all()
        existing_hashes = [log[0] for log in recent_logs if log[0]]
        is_dup = is_duplicate(img_hash, existing_hashes, threshold=5)

    # 3. Run Roboflow Detection
    detection_result = run_roboflow_detection(image_bytes)

    if not detection_result.get("success", False) and detection_result.get("error"):
        raise HTTPException(status_code=502, detail=f"Roboflow API error: {detection_result.get('error')}")

    return {
        "is_duplicate": is_dup,
        "image_hash": img_hash,
        "total_items": detection_result["total_items"],
        "total_credits": detection_result["total_credits"],
        "predictions": detection_result["predictions"],
        "image_dimensions": detection_result["image_dimensions"],
    }

@app.post("/api/claim")
def claim_points(request: ClaimPointsRequest, session: Session = Depends(db.get_db)):
    """
    STEP 2 OF SCAN FLOW ('รับแต้ม'):
    User confirms detected items. Awards credits, increments scan count,
    saves classification log to history, and updates faculty stats.
    """
    user = session.query(models.User).filter(models.User.student_id == request.student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found.")

    # Award credits and increment count
    user.credits += request.total_credits
    user.total_scanned += max(1, len(request.items))

    # Update faculty statistics
    stats = get_or_create_faculty_stats(session)
    stats.total_scans += max(1, len(request.items))
    if stats.total_scans >= stats.next_tree_goal:
        stats.trees_planted += 1
        stats.next_tree_goal += 25

    # Create classification log entry
    log_entry = models.ClassificationLog(
        student_id=request.student_id,
        image_hash=request.image_hash,
        items_json=json.dumps(request.items, ensure_ascii=False),
        total_items=len(request.items),
        points_awarded=request.total_credits,
        location=request.location or "อาคาร ICT ชั้น 1",
        timestamp=datetime.utcnow()
    )
    session.add(log_entry)
    session.commit()
    session.refresh(user)
    session.refresh(stats)

    return {
        "success": True,
        "credits_earned": request.total_credits,
        "user": {
            "student_id": user.student_id,
            "credits": user.credits,
            "total_scanned": user.total_scanned,
        },
        "faculty_stats": {
            "total_scans": stats.total_scans,
            "trees_planted": stats.trees_planted,
            "next_tree_goal": stats.next_tree_goal,
        }
    }

@app.get("/api/history/{student_id}")
def get_student_history(student_id: str, session: Session = Depends(db.get_db)):
    """Returns past scans for a student with item breakdown and dates."""
    logs = session.query(models.ClassificationLog)\
        .filter(models.ClassificationLog.student_id == student_id)\
        .order_by(models.ClassificationLog.timestamp.desc()).limit(100).all()

    formatted_history = []
    for log in logs:
        try:
            items = json.loads(log.items_json)
        except Exception:
            items = []
        formatted_history.append({
            "id": log.id,
            "student_id": log.student_id,
            "items": items,
            "total_items": log.total_items,
            "points_awarded": log.points_awarded,
            "location": log.location,
            "timestamp": log.timestamp.strftime("%d/%m/%Y %H:%M") if log.timestamp else ""
        })

    return formatted_history

@app.get("/api/prizes")
def get_prizes():
    """Returns available prizes catalog matching the Figma design."""
    return [
        {
            "id": "prize-headphones",
            "name": "หูฟังไร้สาย",
            "description": "หูฟังไร้สายคุณภาพเสียงคมชัด สำหรับการเรียนและฟังเพลง",
            "credits_cost": 100,
            "icon": "Headphones",
            "category": "Gadgets",
            "available": True,
        },
        {
            "id": "prize-umbrella",
            "name": "ร่มพับพกพา",
            "description": "ร่มพับพกพากัน UV ลายพิเศษ SnapGreen x ICT",
            "credits_cost": 300,
            "icon": "Umbrella",
            "category": "Accessories",
            "available": True,
        },
        {
            "id": "prize-bottle",
            "name": "กระบอกน้ำเก็บอุณหภูมิ",
            "description": "กระบอกน้ำสแตนเลสรักษ์โลก เก็บความเย็นได้ 12 ชั่วโมง",
            "credits_cost": 250,
            "icon": "Coffee",
            "category": "Eco-friendly",
            "available": True,
        },
        {
            "id": "prize-coffee-discount",
            "name": "คูปองเครื่องดื่ม 20 บาท",
            "description": "ส่วนลด 20 บาท ร้านกาแฟคาเฟ่คณะ ICT",
            "credits_cost": 80,
            "icon": "Ticket",
            "category": "Food & Drink",
            "available": True,
        }
    ]

@app.post("/api/redeem")
def redeem_prize(request: RedeemRequest, session: Session = Depends(db.get_db)):
    """Redeems a prize, deducts credits, and generates a redemption voucher."""
    user = session.query(models.User).filter(models.User.student_id == request.student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found.")

    if user.credits < request.credits_cost:
        raise HTTPException(status_code=400, detail=f"Insufficient credits. Need {request.credits_cost} credits.")

    # Deduct credits
    user.credits -= request.credits_cost

    # Generate unique voucher code
    voucher_code = f"ICT-{uuid.uuid4().hex[:8].upper()}"

    redemption = models.PrizeRedemption(
        student_id=request.student_id,
        prize_id=request.prize_id,
        prize_name=request.prize_name,
        credits_spent=request.credits_cost,
        voucher_code=voucher_code,
        status="active",
        timestamp=datetime.utcnow()
    )
    session.add(redemption)
    session.commit()
    session.refresh(user)

    return {
        "success": True,
        "voucher_code": voucher_code,
        "prize_name": request.prize_name,
        "credits_spent": request.credits_cost,
        "remaining_credits": user.credits,
        "redeemed_at": redemption.timestamp.strftime("%d/%m/%Y %H:%M")
    }

@app.get("/api/plants")
def get_green_space_plants():
    """Returns tree and plant installations with map pin coordinates matching Figma."""
    return [
        {
            "id": 1,
            "name": "ลิ้นมังกร",
            "species": "Sansevieria trifasciata",
            "location": "หน้าลิฟต์ชั้น 1",
            "floor": 1,
            "pin_x": 58,
            "pin_y": 68,
            "status": "ปลูกแล้ว",
            "co2_impact": "120g CO2/วัน",
            "image": "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=300&auto=format&fit=crop&q=60"
        },
        {
            "id": 2,
            "name": "พลูด่าง",
            "species": "Epipremnum aureum",
            "location": "โถงบันไดทิศเหนือ ชั้น 1",
            "floor": 1,
            "pin_x": 25,
            "pin_y": 42,
            "status": "ปลูกแล้ว",
            "co2_impact": "85g CO2/วัน",
            "image": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=300&auto=format&fit=crop&q=60"
        },
        {
            "id": 3,
            "name": "กวักมรกต",
            "species": "Zamioculcas zamiifolia",
            "location": "ห้อง Co-working Space ชั้น 2",
            "floor": 2,
            "pin_x": 48,
            "pin_y": 30,
            "status": "ปลูกแล้ว",
            "co2_impact": "150g CO2/วัน",
            "image": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=300&auto=format&fit=crop&q=60"
        },
        {
            "id": 4,
            "name": "ยางอินเดีย",
            "species": "Ficus elastica",
            "location": "ทางเข้าหลัก คณะ ICT",
            "floor": 1,
            "pin_x": 78,
            "pin_y": 32,
            "status": "ปลูกแล้ว",
            "co2_impact": "210g CO2/วัน",
            "image": "https://images.unsplash.com/photo-1604762524889-3e2fccbc95f8?w=300&auto=format&fit=crop&q=60"
        },
        {
            "id": 5,
            "name": "เฟิร์นบอสตัน",
            "species": "Nephrolepis exaltata",
            "location": "สวนหย่อมระเบียง ชั้น 2",
            "floor": 2,
            "pin_x": 62,
            "pin_y": 55,
            "status": "ปลูกแล้ว",
            "co2_impact": "95g CO2/วัน",
            "image": "https://images.unsplash.com/photo-1545241047-6083a3684587?w=300&auto=format&fit=crop&q=60"
        },
        {
            "id": 6,
            "name": "ต้นลิ้นมังกรต้นที่ 2",
            "species": "Sansevieria trifasciata",
            "location": "โถงชั้น 2",
            "floor": 2,
            "pin_x": 38,
            "pin_y": 70,
            "status": "กำลังปลดล็อค (76%)",
            "co2_impact": "120g CO2/วัน",
            "image": "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=300&auto=format&fit=crop&q=60"
        }
    ]
