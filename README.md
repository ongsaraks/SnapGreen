# MUICT SnapGreen (Version 3)

ระบบจำแนกขยะอัจฉริยะ (AI Smart Scanner) คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (MUICT)
เวอร์ชัน 3 ปรับปรุงดีไซน์โมบายล์แอปพลิเคชันใหม่ตาม Figma, เชื่อมต่อโมเดล Roboflow YOLOv8/v26n ผ่าน Serverless API, รองรับการแสดงผล Bounding Box แบบไดนามิกพร้อมแท็กชื่อภาษาไทย, ระบบยืนยันรับแต้ม 2 ขั้นตอน (Scan -> รับแต้ม), แคตตาล็อกแลกของรางวัลพร้อมรหัสคูปอง, และแผนที่พื้นที่สีเขียวคณะ ICT แบบอินเทอร์แอคทีฟ

---

## โครงสร้างโปรเจกต์ (Project Structure)

```text
Version3/
├── backend/
│   ├── main.py                     # FastAPI server และ REST endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Roboflow API key & model settings
│   ├── database/
│   │   ├── db.py                   # SQLite database engine
│   │   └── models.py               # ตาราง Users, ClassificationLogs, Redemptions, Stats
│   ├── services/
│   │   ├── roboflow_service.py     # ตัวเชื่อมต่อ Roboflow Hosted Inference API
│   │   └── trash_config.py         # กำหนดชุดถังขยะและคลาสของโมเดล (ปรับแต่งได้ง่าย)
│   └── utils/
│       └── image_hash.py           # ระบบตรวจจับภาพซ้ำ (Perceptual Hashing)
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js          # ธีมสีตาม Figma (#5C4B3C, #B8E348, #9E8573, #F4F5EE)
    ├── src/
    │   ├── config/
    │   │   ├── trashClasses.js     # 📌 กำหนดสี Bounding Box, การจัดกลุ่มลงถังขยะ, และชื่อภาษาไทย
    │   │   └── rewards.js          # 📌 กำหนดรายการของรางวัลและจำนวนแต้มที่ใช้แลก
    │   ├── components/
    │   │   ├── LoginView.jsx       # หน้า Login ตามดีไซน์ Figma แถบโค้งสีน้ำตาล
    │   │   ├── HomeView.jsx        # หน้าหลัก สรุปแต้ม, เป้าหมายต้นไม้, สแกนขยะตอนนี้เลย
    │   │   ├── ScanView.jsx        # หน้าสแกนกล้องสดพร้อม Viewfinder และอัปโหลดไฟล์
    │   │   ├── BoundingBoxOverlay.jsx # กรอบ Bounding Box มนและแท็กหัวกรอบตามสีของคลาส
    │   │   ├── ClaimPointsCard.jsx # การ์ดสรุปรายการขยะที่พบพร้อมปุ่ม "รับแต้ม"
    │   │   ├── HistoryPrizesView.jsx # แถบสลับ "บันทึกขยะของฉัน" และ "แลกของรางวัล"
    │   │   ├── VoucherModal.jsx    # ป๊อปอัปแสดงรหัสคูปองรับรางวัล
    │   │   └── GreenSpaceView.jsx  # แผนที่ผังชั้น ICT พร้อมหมุดต้นไม้แบบคลิกดูรายละเอียด
    │   ├── services/
    │   │   └── api.js              # ตัวเรียก API ฝั่ง Frontend
    │   ├── App.jsx                 # ตัวควบคุม State และแถบเมนูด้านล่าง 4 เมนู
    │   ├── index.css
    │   └── main.jsx
```

---

## 🛠️ วิธีการปรับแต่งการทำงาน (Customization Guide)

### 1. วิธีเปลี่ยนถังขยะหรือย้ายคลาส (เช่น ย้ายขวดพลาสติก/แก้วพลาสติกไปถังสีน้ำเงิน)
เปิดไฟล์:
- Frontend: `Version3/frontend/src/config/trashClasses.js`
- Backend: `Version3/backend/services/trash_config.py`

ในตัวแปร `TRASH_BINS` หรือ `BIN_SETS`:
```javascript
BLUE: {
  id: 'blue',
  name: 'ถังสีน้ำเงิน',
  type: 'ขยะทั่วไป',
  classes: [
    'Snack_Wrapper',
    'Plastic_Bag',
    'Plastic_Bottle', // ย้ายมาใส่ตรงนี้ได้เลย!
    'Plastic_Cup',    // ย้ายมาใส่ตรงนี้ได้เลย!
  ]
}
```

### 2. วิธีเปลี่ยนสี Bounding Box และ Badge ของคลาสเฉพาะเจาะจง
ในไฟล์ `Version3/frontend/src/config/trashClasses.js`:
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
เปิดไฟล์ `Version3/frontend/src/config/rewards.js`:
```javascript
export const REWARDS_CATALOG = [
  {
    id: 'prize-headphones',
    name: 'หูฟังไร้สาย',
    description: 'หูฟังไร้สาย Bluetooth สำหรับการเรียนและฟังเพลง',
    creditsCost: 100, // จำนวนแต้มที่ใช้แลก
    category: 'แกดเจ็ต',
    iconType: 'Headphones', // หรือ 'Umbrella', 'Coffee', 'Ticket'
    available: true,
  },
  // เพิ่มของรางวัลใหม่ที่นี่ได้เลย
];
```

---

## 🚀 วิธีการรันโปรเจกต์ (How to Run)

### 1. รัน Backend (FastAPI)
```bash
cd Version3/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
API Docs จะพร้อมใช้งานที่: `http://localhost:8000/docs`

### 2. รัน Frontend (Vite + React)
```bash
cd Version3/frontend
npm install
npm run dev
```
เข้าใช้งานผ่านเว็บเบราว์เซอร์ที่: `http://localhost:5173`
(สามารถทดสอบได้ทั้งบนหน้าจอ Desktop และ Mobile)
