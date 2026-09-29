from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime
from database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(64), unique=True, index=True, nullable=False)
    credits = Column(Integer, default=0, nullable=False)
    total_scanned = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FacultyStats(Base):
    __tablename__ = "faculty_stats"

    id = Column(Integer, primary_key=True, default=1)
    total_scans = Column(Integer, default=0)
    trees_planted = Column(Integer, default=5)
    next_tree_goal = Column(Integer, default=100)

class ClassificationLog(Base):
    __tablename__ = "classification_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(64), index=True, nullable=False)
    image_hash = Column(String(64), index=True, nullable=True)
    items_json = Column(Text, nullable=False) # JSON serialized list of detected items
    total_items = Column(Integer, default=1)
    points_awarded = Column(Integer, default=15)
    location = Column(String(128), default="อาคารคณะ ICT")
    timestamp = Column(DateTime, default=datetime.utcnow)

class PrizeRedemption(Base):
    __tablename__ = "prize_redemptions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(64), index=True, nullable=False)
    prize_id = Column(String(64), nullable=False)
    prize_name = Column(String(128), nullable=False)
    credits_spent = Column(Integer, nullable=False)
    voucher_code = Column(String(32), unique=True, index=True, nullable=False)
    status = Column(String(32), default="active") # active, claimed
    timestamp = Column(DateTime, default=datetime.utcnow)
