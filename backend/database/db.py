import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    # If on Vercel serverless environment, local workspace directory is read-only
    if os.getenv("VERCEL"):
        DB_PATH = "/tmp/snapgreen_v3.sqlite"
    else:
        DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "snapgreen_v3.sqlite")
    
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    # check_same_thread=False is needed for SQLite multi-threaded requests in FastAPI
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
