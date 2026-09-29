import React, { useState } from 'react';
import {
  Power,
  Trash2,
  Gift,
  Headphones,
  Umbrella,
  Coffee,
  Ticket,
  ChevronRight,
  Clock,
  Loader2,
} from 'lucide-react';
import { REWARDS_CATALOG } from '../config/rewards';
import VoucherModal from './VoucherModal';
import { redeemPrize } from '../services/api';

export default function HistoryPrizesView({
  studentId,
  userStats,
  historyScans = [],
  onLogout,
  onUserUpdate,
  initialSubTab = 'history', // 'history' or 'prizes'
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [activeVoucher, setActiveVoucher] = useState(null);

  const credits = userStats?.credits ?? 155;
  const totalScanned = userStats?.total_scanned ?? 16;

  // Icon mapper for rewards
  const renderRewardIcon = (iconType) => {
    switch (iconType) {
      case 'Headphones':
        return <Headphones size={22} className="text-[#8C7B6B]" />;
      case 'Umbrella':
        return <Umbrella size={22} className="text-[#8C7B6B]" />;
      case 'Coffee':
        return <Coffee size={22} className="text-[#8C7B6B]" />;
      default:
        return <Ticket size={22} className="text-[#8C7B6B]" />;
    }
  };

  // Handle reward redemption
  const handleRedeem = async (reward) => {
    if (credits < reward.creditsCost) return;
    if (!confirm(`ยืนยันการแลก "${reward.name}" โดยใช้ ${reward.creditsCost} Credits หรือไม่?`)) return;

    setIsRedeeming(true);
    try {
      const res = await redeemPrize({
        studentId: studentId,
        prizeId: reward.id,
        prizeName: reward.name,
        creditsCost: reward.creditsCost,
      });

      if (onUserUpdate) {
        onUserUpdate({
          ...userStats,
          credits: res.remaining_credits,
        });
      }

      setActiveVoucher(res);
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการแลกรางวัล');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-24 tab-content-enter overflow-y-auto no-scrollbar bg-[#F4F5EE]">
      {/* Top Brown Header with Dual Pill Toggle */}
      <div className="bg-[#5C4B3C] text-white pt-10 pb-5 px-5 rounded-b-3xl shadow-md">
        {/* Student ID & Logout */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold tracking-wide text-[#E2DACF]">
            {studentId || '67XXXXX'}
          </span>
          <button
            onClick={onLogout}
            title="ออกจากระบบ"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all"
          >
            <Power size={15} className="text-[#E2DACF]" />
          </button>
        </div>

        {/* Dual Tab Switcher Pills */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all ${
              activeSubTab === 'history'
                ? 'bg-[#8EBE36] text-[#283B08] shadow-xs'
                : 'bg-white/10 hover:bg-white/15 text-[#D1C7BA]'
            }`}
          >
            บันทึกขยะของฉัน • ICT
          </button>

          <button
            onClick={() => setActiveSubTab('prizes')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all ${
              activeSubTab === 'prizes'
                ? 'bg-[#B8E348] text-[#283B08] shadow-xs'
                : 'bg-white/10 hover:bg-white/15 text-[#D1C7BA]'
            }`}
          >
            แลกของรางวัล
          </button>
        </div>

        {/* Dynamic Header Card */}
        {activeSubTab === 'history' ? (
          /* History Stats Card */
          <div className="bg-[#B8E348] text-[#344012] rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex-1 pl-1">
              <div className="text-[11px] font-medium text-[#465718]">
                Green credits
              </div>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-3xl font-extrabold tracking-tight">
                  {credits}
                </span>
                <span className="text-sm font-bold">pt</span>
              </div>
            </div>

            <div className="w-[1px] h-10 bg-[#344012]/15 mx-3" />

            <div className="flex-1 pl-2">
              <div className="text-[11px] font-medium text-[#465718]">
                สแกนไปแล้ว
              </div>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-3xl font-extrabold tracking-tight">
                  {totalScanned}
                </span>
                <span className="text-sm font-bold">ชิ้น</span>
              </div>
            </div>
          </div>
        ) : (
          /* Prizes Gift Card */
          <div className="bg-[#B8E348] text-[#344012] rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="pl-1">
              <div className="text-[11px] font-medium text-[#465718]">
                Green credits
              </div>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-3xl font-extrabold tracking-tight">
                  {credits}
                </span>
                <span className="text-sm font-bold">pt</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#344012]/10 flex items-center justify-center">
              <Gift size={32} className="text-[#344012]" />
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="px-5 pt-4 flex-1">
        {activeSubTab === 'history' ? (
          /* Sub-tab 1: Scan History List */
          <div>
            <h3 className="text-xs font-bold text-[#5C4B3C] mb-3 px-1">
              กิจกรรมล่าสุด
            </h3>

            <div className="space-y-2.5">
              {historyScans && historyScans.length > 0 ? (
                historyScans.map((log, idx) => {
                  const items = log.items || [];
                  const firstItem = items[0] || {};
                  const isBlue = firstItem.bin_id === 'blue' || firstItem.bin_name?.includes('น้ำเงิน');
                  const isYellow = firstItem.bin_id === 'yellow' || firstItem.bin_name?.includes('เหลือง');
                  const isGreen = firstItem.bin_id === 'green' || firstItem.bin_name?.includes('เขียว');
                  const isOrange = firstItem.bin_id === 'orange' || firstItem.bin_name?.includes('ส้ม');

                  let bgClass = 'bg-[#0055D4]';
                  if (isYellow) bgClass = 'bg-[#E5A800]';
                  if (isGreen) bgClass = 'bg-[#22C55E]';
                  if (isOrange) bgClass = 'bg-[#EA580C]';

                  return (
                    <div
                      key={log.id || idx}
                      className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#ECEEE0] flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center text-white shrink-0`}
                        >
                          <Trash2 size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#3E342B]">
                            {firstItem.thai_name || 'ขยะ'}
                            {items.length > 1 ? ` (+${items.length - 1} ชิ้น)` : ''}
                          </div>
                          <div className="text-[10px] text-[#8F8375] mt-0.5">
                            {firstItem.bin_name || 'ถังสีน้ำเงิน'} • {log.timestamp || 'วันนี้'} - {log.location || 'อาคาร ICT'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-[#70A528]">
                        +{log.points_awarded || 15}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Default mockup entries matching Figma design */
                <>
                  {[
                    { name: 'ถุงขนม', bin: 'ถังสีน้ำเงิน', pts: 15, isBlue: true },
                    { name: 'กระป๋อง', bin: 'ถังสีเหลือง', pts: 15, isBlue: false },
                    { name: 'กระป๋อง', bin: 'ถังสีเหลือง', pts: 15, isBlue: false },
                    { name: 'ถุงขนม', bin: 'ถังสีน้ำเงิน', pts: 15, isBlue: true },
                    { name: 'ถุงขนม', bin: 'ถังสีน้ำเงิน', pts: 15, isBlue: true },
                    { name: 'กระป๋อง', bin: 'ถังสีเหลือง', pts: 15, isBlue: false },
                    { name: 'ถุงขนม', bin: 'ถังสีน้ำเงิน', pts: 15, isBlue: true },
                  ].map((mock, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#ECEEE0] flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${
                            mock.isBlue ? 'bg-[#0055D4]' : 'bg-[#E5A800]'
                          } flex items-center justify-center text-white shrink-0`}
                        >
                          <Trash2 size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#3E342B]">{mock.name}</div>
                          <div className="text-[10px] text-[#8F8375] mt-0.5">
                            {mock.bin} • วัน - เวลา - สถานที่
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-[#70A528]">+{mock.pts}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          /* Sub-tab 2: Prizes Catalog */
          <div>
            <h3 className="text-xs font-bold text-[#5C4B3C] mb-3 px-1">
              ของรางวัลแนะนำ
            </h3>

            <div className="space-y-3">
              {REWARDS_CATALOG.map((reward) => {
                const canRedeem = credits >= reward.creditsCost;
                const remainingNeeded = reward.creditsCost - credits;

                return (
                  <div
                    key={reward.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-[#ECEEE0] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#F0EFEB] flex items-center justify-center shrink-0">
                        {renderRewardIcon(reward.iconType)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#3E342B]">
                          {reward.name}
                        </div>
                        <div className="text-[11px] text-[#8F8375] mt-0.5">
                          {reward.creditsCost} Credits
                        </div>
                      </div>
                    </div>

                    <div>
                      {canRedeem ? (
                        <button
                          onClick={() => handleRedeem(reward)}
                          disabled={isRedeeming}
                          className="px-4 py-2 rounded-xl bg-[#5C4B3C] hover:bg-[#4E3F32] active:scale-95 text-white text-xs font-semibold transition-all shadow-xs"
                        >
                          แลกเลย
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3.5 py-2 rounded-xl bg-[#D6D6D0] text-[#7A7670] text-xs font-medium cursor-not-allowed"
                        >
                          อีก {remainingNeeded}pt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Voucher Popup Modal */}
      {activeVoucher && (
        <VoucherModal
          voucher={activeVoucher}
          onClose={() => setActiveVoucher(null)}
        />
      )}
    </div>
  );
}
