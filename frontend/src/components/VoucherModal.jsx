import React from 'react';
import { CheckCircle, X, Sparkles, QrCode, Ticket } from 'lucide-react';

export default function VoucherModal({ voucher, onClose }) {
  if (!voucher) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#F4F5EE] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E5E5D8] relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 hover:bg-white text-[#5C4B3C] flex items-center justify-center transition-all"
        >
          <X size={18} />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#B8E348]/30 flex items-center justify-center mx-auto mb-3 text-[#537418]">
          <CheckCircle size={36} />
        </div>

        <h3 className="text-lg font-bold text-[#3E342B] mb-1">
          แลกของรางวัลสำเร็จ!
        </h3>
        <p className="text-xs text-[#7A6B5D] mb-5">
          นำรหัสคูปองนี้ไปแสดงเพื่อรับของรางวัลที่เคาน์เตอร์คณะ ICT
        </p>

        {/* Voucher Ticket Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-dashed border-[#B8B8B8] mb-5">
          <div className="text-[11px] text-[#8C8276] uppercase tracking-wider mb-1 font-semibold">
            {voucher.prize_name || 'ของรางวัล'}
          </div>
          <div className="text-2xl font-black text-[#5C4B3C] tracking-widest my-2 select-all font-mono">
            {voucher.voucher_code || 'ICT-VOUCHER'}
          </div>
          <div className="text-[10px] text-[#A69B8F]">
            แลกเมื่อ: {voucher.redeemed_at || 'วันนี้'} • ใช้ได้ถึง 30 วัน
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#5C4B3C] hover:bg-[#4E3F32] text-white font-semibold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98]"
        >
          เรียบร้อย
        </button>
      </div>
    </div>
  );
}
