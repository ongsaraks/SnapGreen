import React from 'react';
import { Power, Camera, Sprout, ChevronRight, Sparkles, Trash2, ArrowUpRight } from 'lucide-react';

export default function HomeView({
  studentId,
  userStats,
  facultyStats,
  recentScans,
  onOpenScanner,
  onViewAllHistory,
  onLogout,
}) {
  const credits = userStats?.credits ?? 155;
  const totalScanned = userStats?.total_scanned ?? 16;
  const totalFacultyScans = facultyStats?.total_scans ?? 16;
  const nextGoal = facultyStats?.next_tree_goal ?? 28;
  const remainingForGoal = Math.max(0, nextGoal - totalFacultyScans);
  const progressPercent = Math.min(100, Math.round((totalFacultyScans / nextGoal) * 100));

  return (
    <div className="flex-1 flex flex-col pb-24 tab-content-enter overflow-y-auto no-scrollbar">
      {/* Top Brown Header with Student ID & Stats Card */}
      <div className="bg-[#5C4B3C] text-white pt-10 pb-6 px-5 rounded-b-3xl shadow-md">
        {/* Header Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold tracking-wide text-[#E2DACF]">
              {studentId || '67XXXXX'}
            </span>
          </div>
          <button
            onClick={onLogout}
            title="ออกจากระบบ"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all"
          >
            <Power size={15} className="text-[#E2DACF]" />
          </button>
        </div>

        {/* Stats Pill Banner */}
        <div className="bg-[#6B5746] rounded-2xl p-4 flex items-center justify-between border border-white/5">
          {/* Green credits */}
          <div className="flex-1 pl-1">
            <div className="text-[11px] text-[#C8BDB0] font-medium tracking-wide">
              Green credits
            </div>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-3xl font-extrabold text-[#B8E348] tracking-tight">
                {credits}
              </span>
              <span className="text-sm font-semibold text-[#B8E348]">pt</span>
            </div>
          </div>

          <div className="w-[1px] h-10 bg-white/10 mx-3" />

          {/* Scanned count */}
          <div className="flex-1 pl-2">
            <div className="text-[11px] text-[#C8BDB0] font-medium tracking-wide">
              สแกนไปแล้ว
            </div>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {totalScanned}
              </span>
              <span className="text-sm font-semibold text-[#E2DACF]">ชิ้น</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="px-5 pt-4 space-y-4">
        {/* Next Tree Goal Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EBECE1]">
          <div className="flex items-center space-x-2 text-[#446522] mb-1">
            <Sprout size={16} className="text-[#72A633]" />
            <span className="text-xs font-bold tracking-wide">
              เป้าหมายต้นไม้ถัดไป
            </span>
          </div>

          <div className="text-[11px] text-[#8C8276] mb-2.5">
            อีก {remainingForGoal} ชิ้น ปลดล็อคต้นไม้ต้นถัดไป
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E5E8D8] h-2.5 rounded-full overflow-hidden p-[1px]">
            <div
              className="bg-[#8CC63F] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2 text-[10px] text-[#9E9488] font-medium flex items-center justify-between">
            <span>{progressPercent}% ต้นลิ้นมังกรต้นที่ 2</span>
            <span>สถานที่ : โถงชั้น 2</span>
          </div>
        </div>

        {/* Big Lime Scan Action Banner Card */}
        <div
          onClick={onOpenScanner}
          className="bg-[#B8E348] hover:bg-[#ABDC36] active:scale-[0.98] transition-all cursor-pointer rounded-2xl p-4 shadow-md flex items-center justify-between group"
        >
          <div className="pr-3">
            <div className="text-[11px] text-[#4F6317] font-medium">
              เตรียมพร้อมไปทิ้งขยะกันแล้วใช่ไหม
            </div>
            <div className="text-base font-extrabold text-[#2F3C0D] mt-0.5 tracking-tight">
              สแกนขยะตอนนี้เลย
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#5C4B3C] text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <Camera size={22} className="text-white" />
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-[#5C4B3C] tracking-wide">
              กิจกรรมล่าสุด
            </h3>
            <button
              onClick={onViewAllHistory}
              className="text-[11px] font-semibold text-[#8C7A68] hover:text-[#5C4B3C] transition-colors"
            >
              ดูทั้งหมด
            </button>
          </div>

          {/* Activity items list */}
          <div className="space-y-2.5">
            {recentScans && recentScans.length > 0 ? (
              recentScans.slice(0, 3).map((scan, idx) => {
                const firstItem = scan.items?.[0] || {};
                const binColor = firstItem.bin_color || '#2563eb';
                const isBlue = firstItem.bin_id === 'blue' || firstItem.bin_name?.includes('น้ำเงิน');
                return (
                  <div
                    key={scan.id || idx}
                    className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#ECEEE0] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                          isBlue ? 'bg-[#0055D4]' : 'bg-[#E5A800]'
                        }`}
                      >
                        <Trash2 size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#3E342B]">
                          {firstItem.thai_name || 'ขยะทั่วไป'}
                          {scan.total_items > 1 ? ` (+${scan.total_items - 1})` : ''}
                        </div>
                        <div className="text-[10px] text-[#8F8375] mt-0.5">
                          {firstItem.bin_name || 'ถังสีน้ำเงิน'} • {scan.timestamp || 'วันนี้'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-extrabold text-[#70A528]">
                      +{scan.points_awarded || 15}
                    </div>
                  </div>
                );
              })
            ) : (
              // Default mockup activity items matching Figma (Snack Wrapper & Can)
              <>
                <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#ECEEE0] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0055D4] flex items-center justify-center text-white shrink-0">
                      <Trash2 size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#3E342B]">ถุงขนม</div>
                      <div className="text-[10px] text-[#8F8375] mt-0.5">
                        ถังสีน้ำเงิน • วันนี้ - หน้าลิฟต์ชั้น 1
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-[#70A528]">+15</div>
                </div>

                <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#ECEEE0] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E5A800] flex items-center justify-center text-white shrink-0">
                      <Trash2 size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#3E342B]">กระป๋อง</div>
                      <div className="text-[10px] text-[#8F8375] mt-0.5">
                        ถังสีเหลือง • เมื่อวาน - โถงชั้น 1
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-[#70A528]">+15</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
