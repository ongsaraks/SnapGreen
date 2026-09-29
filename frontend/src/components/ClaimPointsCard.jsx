import React from 'react';
import { Trash2, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { getClassMeta } from '../config/trashClasses';

export default function ClaimPointsCard({
  predictions = [],
  totalCredits = 0,
  onClaim,
  onRetake,
  isClaiming = false,
}) {
  const count = predictions.length;

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl p-5 border-t border-[#EBECE1] animate-in slide-in-from-bottom duration-300">
      {/* Title & Total Credits Badge */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-[#3E342B]">
          {count > 0 ? `ตรวจพบ ${count} ชิ้น` : 'ไม่พบขยะในภาพ'}
        </h3>
        <div className="text-xs font-extrabold text-[#70A528] mt-0.5">
          {count > 0 ? `+${totalCredits} Credits` : 'กรุณาลองถ่ายใหม่อีกครั้ง'}
        </div>
      </div>

      {/* Detected Items List */}
      <div className="max-h-48 overflow-y-auto space-y-2.5 mb-4 pr-1">
        {predictions.map((item, idx) => {
          const meta = getClassMeta(item.raw_class);
          const binColor = item.bin_color || meta.binColor || '#2563eb';
          const isBlue = item.bin_id === 'blue' || meta.binId === 'blue';
          const isYellow = item.bin_id === 'yellow' || meta.binId === 'yellow';
          const isGreen = item.bin_id === 'green' || meta.binId === 'green';
          const isOrange = item.bin_id === 'orange' || meta.binId === 'orange';

          let bgClass = 'bg-[#0055D4]';
          if (isYellow) bgClass = 'bg-[#E5A800]';
          if (isGreen) bgClass = 'bg-[#22C55E]';
          if (isOrange) bgClass = 'bg-[#EA580C]';

          return (
            <div
              key={item.id || idx}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F8F9F3] border border-[#ECEFE2]"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center text-white shrink-0`}
                >
                  <Trash2 size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#3E342B]">
                    {item.thai_name || meta.thaiName}
                  </div>
                  <div className="text-[10px] text-[#8F8375] mt-0.5">
                    {item.bin_name || meta.binName} • วันนี้ - อาคาร ICT
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold text-[#70A528]">
                +{item.points || 15}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onRetake}
          disabled={isClaiming}
          className="py-3 px-4 rounded-2xl bg-[#ECEEE3] hover:bg-[#E0E3D5] text-[#5C4B3C] font-semibold text-xs flex items-center justify-center space-x-1 transition-all active:scale-95"
        >
          <RotateCcw size={15} />
          <span>ถ่ายใหม่</span>
        </button>

        <button
          onClick={onClaim}
          disabled={isClaiming || count === 0}
          className="flex-1 py-3.5 px-4 bg-[#B8E348] hover:bg-[#A6D433] text-[#2F3C0D] font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isClaiming ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>รับแต้ม</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
