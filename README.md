# MUICT SnapGreen

ระบบจำแนกขยะอัจฉริยะ (AI Smart Waste Classification & Gamification)  
คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (MUICT)

MUICT SnapGreen เป็นเว็บแอปพลิเคชันที่นำเทคโนโลยี Computer Vision เข้ามาช่วยส่งเสริมการแยกขยะในคณะ ICT โดยเชื่อมต่อโมเดล AI ผ่าน Roboflow YOLOv8/v26n รองรับการตรวจจับขยะหลายชิ้นพร้อมกัน แสดงผล Bounding Box ภาษาไทยแบบไดนามิก พร้อมระบบเกมสะสมแต้มแลกของรางวัล และแผนที่พื้นที่สีเขียวแบบอินเทอร์แอคทีฟ

---

## ✨ ฟีเจอร์หลัก (Key Features)

- **AI Object Detection:** ตรวจจับและระบุประเภทขยะแบบ Real-time พร้อมวาดกรอบ Bounding Box และคำแนะนำถังขยะที่ถูกต้อง (ถังสีน้ำเงิน, ถังสีเหลือง, ถังสีเขียว, ถังสีส้ม)
- **Anti-Fraud Duplicate Prevention:** ระบบตรวจสอบภาพซ้ำด้วย Perceptual Image Hashing (dHash) ป้องกันการนำรูปเดิมมาสแกนซ้ำเพื่อปั๊มแต้ม
- **2-Step Claim Flow:** ระบบยืนยันรับแต้ม 2 ขั้นตอน (สแกนตรวจจับ -> ตรวจสอบรายการ -> กดยืนยันรับแต้ม)
- **Rewards & Voucher System:** แคตตาล็อกของรางวัลสำหรับนักศึกษา พร้อมระบบสร้างรหัสคูปอง (Voucher Code) เฉพาะบุคคล
- **Interactive Green Space Map:** แผนที่ผังชั้นอาคาร ICT แสดงจุดทิ้งขยะและต้นไม้ที่ร่วมกันปลูกจากการแยกขยะ
- **Mobile-First Responsive UI:** ออกแบบตาม Figma ธีมสี Earth-tone สวยงาม รองรับทั้งสมาร์ทโฟนและเดสก์ท็อป

---

## 🛠️ สถาปัตยกรรมและเทคโนโลยี (Tech Stack)

| ส่วนประกอบ | เทคโนโลยี | รายละเอียด |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons | Single Page Application (SPA), Mobile-first UI |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy, SQLite | High-performance Asynchronous RESTful API |
| **AI / Computer Vision** | Roboflow Hosted Inference (YOLOv26n) | Object Detection รองรับขยะ 22+ คลาส |
| **DevOps & Container** | Docker, Docker Compose, Nginx Alpine | Multi-stage build สำหรับรัน Production ได้ทันที |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── backend/
│   ├── main.py                     # FastAPI server และ REST endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Production-ready Python 3.11-slim container
│   ├── .env.example                # ตัวอย่างการตั้งค่า Environment Variables
│   ├── vercel.json                 # การตั้งค่าสำหรับ Serverless Functions บน Vercel
│   ├── api/
│   │   └── index.py                # Vercel Serverless Function entry point
│   ├── database/
│   │   ├── db.py                   # SQLAlchemy engine (รองรับทั้ง SQLite และ PostgreSQL)
│   │   └── models.py               # ตาราง Users, ClassificationLogs, Redemptions, Stats
│   ├── services/
│   │   ├── roboflow_service.py     # ตัวเชื่อมต่อ Roboflow Hosted Inference + Payload Optimizer
│   │   └── trash_config.py         # กำหนดชุดถังขยะและคลาสโมเดล
│   └── utils/
│       └── image_hash.py           # Perceptual Hashing ตรวจสอบภาพซ้ำ
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile                  # Multi-stage build (Node 20 -> Nginx Alpine)
│   ├── nginx.conf                  # Nginx configuration สำหรับ SPA routing
│   ├── tailwind.config.js          # ธีมสี Earth-tone ตาม Figma
│   ├── vercel.json                 # การตั้งค่า Routing สำหรับ Vercel SPA
│   └── src/
│       ├── config/
│       │   ├── trashClasses.js     # กำหนดสี Bounding Box, การจัดกลุ่มลงถัง, และชื่อภาษาไทย
│       │   └── rewards.js          # รายการของรางวัลและแต้มที่ใช้แลก
│       ├── components/             # UI Components (ScanView, HomeView, GreenSpaceView ฯลฯ)
│       ├── services/api.js         # API Client เชื่อมต่อ Backend
│       ├── App.jsx                 # Main Application Layout & Bottom Navigation
│       └── main.jsx
├── docker-compose.yml              # ไฟล์จัดการ Container ทั้ง Frontend และ Backend
└── .gitignore
```

---

## 🚀 วิธีการรันโปรเจกต์ (How to Run)

### วิธีที่ 1: รันด้วย Docker (แนะนำ - ง่ายและเร็วที่สุด) 🐳

เพียงติดตั้ง [Docker Desktop](https://www.docker.com/) แล้วรันคำสั่งเดียวที่โฟลเดอร์โปรเจกต์:

```bash
# สั่ง Build และรันทั้ง Frontend + Backend ในพื้นหลัง
docker compose up -d --build
```

- **Frontend:** เข้าใช้งานได้ที่ [http://localhost:5173](http://localhost:5173)
- **Backend API & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Backend Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

หากต้องการหยุดการทำงาน:
```bash
docker compose down
```

---

### วิธีที่ 2: รันแบบ Manual (Local Development)

#### 1. รัน Backend (FastAPI)
```bash
cd backend

# สร้างและเปิดใช้งาน Virtual Environment (แนะนำ)
python -m venv venv
venv\Scripts\activate       # สำหรับ Windows
# source venv/bin/activate  # สำหรับ macOS/Linux

# ติดตั้ง Dependencies
pip install -r requirements.txt

# คัดลอกไฟล์ตั้งค่า .env
cp .env.example .env

# เริ่มต้นเซิร์ฟเวอร์
python -m uvicorn main:app --reload --port 8000
```
API Docs จะพร้อมใช้งานที่: `http://localhost:8000/docs`

#### 2. รัน Frontend (Vite + React)
เปิด Terminal ใหม่อีกหน้าต่าง:
```bash
cd frontend

# ติดตั้ง Dependencies
npm install

# รัน Development Server
npm run dev
```
เข้าใช้งานผ่านเว็บเบราว์เซอร์ที่: `http://localhost:5173`

---

## ⚙️ การตั้งค่า Environment Variables (`backend/.env`)

| Variable | Default Value | Description |
|---|---|---|
| `ROBOFLOW_API_KEY` | `T7uEFXRKxnlKwmjBGbBD` | API Key ของบัญชี Roboflow |
| `ROBOFLOW_MODEL_ID` | `trash-classification-swoem` | ID ของโปรเจกต์โมเดลใน Roboflow |
| `ROBOFLOW_MODEL_VERSION` | `3` | เวอร์ชันของโมเดลที่ต้องการเรียกใช้ |
| `ROBOFLOW_TIMEOUT` | `75` | Request Timeout ป้องกัน Serverless Cold Start |
| `ROBOFLOW_API_URL` | `https://detect.roboflow.com` | Base URL สำหรับ Inference API |
| `PORT` | `8000` | พอร์ตของ Backend Service |
| `HOST` | `0.0.0.0` | Bind Host |
| `DATABASE_URL` | *(Optional)* | Connection string เช่น `postgresql://...` สำหรับ Cloud DB |

---

## 🛠️ วิธีการปรับแต่งการทำงาน (Customization Guide)

### 1. วิธีเปลี่ยนถังขยะหรือย้ายประเภทขยะ
เปิดไฟล์:
- Frontend: `frontend/src/config/trashClasses.js`
- Backend: `backend/services/trash_config.py`

ในตัวแปร `TRASH_BINS` หรือ `BIN_SETS`:
```javascript
BLUE: {
  id: 'blue',
  name: 'ถังสีน้ำเงิน',
  type: 'ขยะทั่วไป',
  classes: [
    'Snack_Wrapper',
    'Plastic_Bag',
    'Plastic_Bottle', // สามารถย้ายขวดน้ำมาใส่ถังนี้ได้ตามต้องการ
  ]
}
```

### 2. วิธีเปลี่ยนสี Bounding Box ของขยะแต่ละประเภท
ในไฟล์ `frontend/src/config/trashClasses.js`:
```javascript
export const CLASS_STYLE_OVERRIDES = {
  'Snack_Wrapper': {
    boxBorder: '#FF2E2E', // สีขอบกรอบ
    badgeBg: '#E60000',   // สีพื้นหลังป้ายชื่อ
    badgeText: '#FFFFFF', // สีตัวอักษร
  },
  'METAL': {
    boxBorder: '#A6805E',
    badgeBg: '#8C6848',
    badgeText: '#FFFFFF',
  }
};
```

### 3. วิธีเพิ่มหรือแก้ไขรายการของรางวัล
เปิดไฟล์ `frontend/src/config/rewards.js`:
```javascript
export const REWARDS_CATALOG = [
  {
    id: 'prize-headphones',
    name: 'หูฟังไร้สาย',
    description: 'หูฟังไร้สาย Bluetooth สำหรับการเรียนและฟังเพลง',
    creditsCost: 100, // แต้มที่ใช้แลก
    category: 'แกดเจ็ต',
    iconType: 'Headphones', // หรือ 'Umbrella', 'Coffee', 'Ticket'
    available: true,
  },
];
```

---

## 📄 License
โปรเจกต์นี้พัฒนาขึ้นเพื่อการศึกษาและการจัดการสิ่งแวดล้อมภายในคณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (MUICT)
