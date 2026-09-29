import React, { useState } from 'react';
import { User, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('กรุณากรอกรหัสนักศึกษา');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onLoginSuccess(studentId.trim());
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5EE] relative overflow-hidden">
      {/* Top Curved Brown Hero Banner */}
      <div className="bg-[#5C4B3C] text-white pt-14 pb-14 px-7 rounded-b-[3.5rem] shadow-xl relative">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#B8E348]/10 blur-2xl pointer-events-none" />

        <div className="max-w-xs">
          <span className="inline-block text-[#B8E348] text-xs font-semibold tracking-wider uppercase mb-3">
            MUICT • Snap-Green
          </span>
          <h1 className="text-3xl font-bold leading-tight mb-4 text-white">
            ใส่รหัสนักศึกษา<br />
            ก็เข้าใช้งานได้เลย
          </h1>
          <p className="text-[#C8BDB0] text-xs leading-relaxed font-light">
            ยืนยันตัวตนด้วยรหัสนักศึกษา เพื่อเริ่มสะสม Green Credits และร่วมสร้างพื้นที่สีเขียวให้คณะ ICT
          </p>
        </div>
      </div>

      {/* Main Login Form Area */}
      <div className="flex-1 px-7 pt-10 pb-8 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-[#7A6B5D] mb-2 pl-1">
              กรอกรหัสนักศึกษา
            </label>
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-[#E5E5D8] px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#B8E348] focus-within:border-transparent transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#F4F5EE] flex items-center justify-center text-[#7A6B5D] mr-3 shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-medium text-[#8F8173] leading-none mb-1">
                  รหัสนักศึกษา
                </div>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="studentID (เช่น 6788001)"
                  className="w-full bg-transparent border-none p-0 text-sm font-semibold text-[#3D332A] placeholder:text-[#C5BEB5] focus:outline-none focus:ring-0"
                  autoFocus
                />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-500 pl-2 animate-shake">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-[#B8E348] hover:bg-[#A8D338] active:scale-[0.98] text-[#3B4515] font-semibold text-base rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>เข้าสู่ระบบ</span>
                <div className="w-7 h-7 rounded-full bg-[#3B4515]/15 flex items-center justify-center ml-1">
                  <ArrowRight size={16} className="text-[#3B4515]" />
                </div>
              </>
            )}
          </button>
        </form>

        {/* Brand footer logo / dots */}
        <div className="flex flex-col items-center justify-center text-center mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8E348]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#9E8573]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#5C4B3C]" />
          </div>
          <span className="text-[11px] text-[#9E8F80]">
            คณะเทคโนโลยีสารสนเทศและการสื่อสาร (ICT) มหาวิทยาลัยมหิดล
          </span>
        </div>
      </div>
    </div>
  );
}
