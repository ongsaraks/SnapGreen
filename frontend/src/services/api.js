const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function loginStudent(studentId) {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'เข้าสู่ระบบไม่สำเร็จ');
  }
  return res.json();
}

export async function getUserProfile(studentId) {
  const res = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(studentId)}`);
  if (!res.ok) {
    throw new Error('ไม่พบข้อมูลผู้ใช้');
  }
  return res.json();
}

export async function getFacultyStats() {
  const res = await fetch(`${API_BASE_URL}/api/stats`);
  if (!res.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลสถิติคณะได้');
  }
  return res.json();
}

export async function detectTrash(imageBlobOrFile, studentId) {
  const formData = new FormData();
  formData.append('file', imageBlobOrFile, 'scan.jpg');
  if (studentId) {
    formData.append('student_id', studentId);
  }

  const res = await fetch(`${API_BASE_URL}/api/detect`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'การตรวจจับล้มเหลว กรุณาลองใหม่');
  }
  return res.json();
}

export async function claimPoints({ studentId, imageHash, items, totalCredits, location }) {
  const res = await fetch(`${API_BASE_URL}/api/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_id: studentId,
      image_hash: imageHash,
      items: items,
      total_credits: totalCredits,
      location: location || 'อาคาร ICT ชั้น 1',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'ไม่สามารถรับแต้มได้ กรุณาลองใหม่');
  }
  return res.json();
}

export async function getScanHistory(studentId) {
  const res = await fetch(`${API_BASE_URL}/api/history/${encodeURIComponent(studentId)}`);
  if (!res.ok) {
    throw new Error('ไม่สามารถโหลดประวัติได้');
  }
  return res.json();
}

export async function getPrizes() {
  const res = await fetch(`${API_BASE_URL}/api/prizes`);
  if (!res.ok) {
    throw new Error('ไม่สามารถโหลดรายการรางวัลได้');
  }
  return res.json();
}

export async function redeemPrize({ studentId, prizeId, prizeName, creditsCost }) {
  const res = await fetch(`${API_BASE_URL}/api/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_id: studentId,
      prize_id: prizeId,
      prize_name: prizeName,
      credits_cost: creditsCost,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'ไม่สามารถแลกของรางวัลได้');
  }
  return res.json();
}

export async function getGreenSpacePlants() {
  const res = await fetch(`${API_BASE_URL}/api/plants`);
  if (!res.ok) {
    throw new Error('ไม่สามารถโหลดข้อมูลพื้นที่สีเขียวได้');
  }
  return res.json();
}
