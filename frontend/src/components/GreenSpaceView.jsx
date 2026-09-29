import React, { useState } from 'react';
import { Power, Leaf, MapPin, Sparkles, X, ChevronRight } from 'lucide-react';

export default function GreenSpaceView({
  studentId,
  userStats,
  facultyStats,
  onLogout,
}) {
  const credits = userStats?.credits ?? 155;
  const totalScanned = userStats?.total_scanned ?? 16;
  const treesPlanted = facultyStats?.trees_planted ?? 5;

  // Plant locations matching Figma layout and pins
  const [plants] = useState([
    {
      id: 1,
      name: 'ลิ้นมังกร',
      species: 'Sansevieria trifasciata',
      location: 'หน้าลิฟต์ชั้น 1',
      floor: 'ชั้น 1',
      x: 58,
      y: 68,
      status: 'ปลูกสำเร็จแล้ว',
      co2: '120g CO2/วัน',
      bgImage: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'พลูด่าง',
      species: 'Epipremnum aureum',
      location: 'โถงบันไดทิศเหนือ',
      floor: 'ชั้น 1',
      x: 22,
      y: 32,
      status: 'ปลูกสำเร็จแล้ว',
      co2: '85g CO2/วัน',
      bgImage: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'กวักมรกต',
      species: 'Zamioculcas zamiifolia',
      location: 'โถงกลาง ชั้น 1',
      floor: 'ชั้น 1',
      x: 48,
      y: 38,
      status: 'ปลูกสำเร็จแล้ว',
      co2: '150g CO2/วัน',
      bgImage: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'ยางอินเดีย',
      species: 'Ficus elastica',
      location: 'ทางเข้าหลักคณะ ICT',
      floor: 'ชั้น 1',
      x: 78,
      y: 40,
      status: 'ปลูกสำเร็จแล้ว',
      co2: '210g CO2/วัน',
      bgImage: 'https://images.unsplash.com/photo-1604762524889-3e2fccbc95f8?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      name: 'เฟิร์นบอสตัน',
      species: 'Nephrolepis exaltata',
      location: 'สวนหย่อมระเบียง',
      floor: 'ชั้น 2',
      x: 36,
      y: 65,
      status: 'ปลูกสำเร็จแล้ว',
      co2: '95g CO2/วัน',
      bgImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      name: 'ลิ้นมังกรต้นที่ 2',
      species: 'Sansevieria trifasciata',
      location: 'โถงชั้น 2',
      floor: 'ชั้น 2',
      x: 76,
      y: 72,
      status: 'กำลังสะสมเพื่อปลดล็อค (76%)',
      co2: '120g CO2/วัน',
      bgImage: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=400&auto=format&fit=crop&q=80',
    },
  ]);

  // Selected plant pin for tooltip/card
  const [selectedPlant, setSelectedPlant] = useState(plants[0]);

  return (
    <div className="flex-1 flex flex-col pb-24 tab-content-enter overflow-y-auto no-scrollbar bg-[#F4F5EE]">
      {/* Top Brown Header with Student ID */}
      <div className="bg-[#5C4B3C] text-white pt-10 pb-5 px-5 rounded-b-3xl shadow-md">
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

        {/* Stats Card */}
        <div className="bg-[#6B5746] rounded-2xl p-4 flex items-center justify-between border border-white/5">
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

      {/* Main Content Area */}
      <div className="px-5 pt-4 space-y-4">
        {/* Planted Trees Goal Hero Banner */}
        <div className="bg-[#B8E348] rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#445813]">
              ปลูกสำเร็จแล้ว
            </div>
            <div className="text-3xl font-black text-[#263209] mt-0.5 tracking-tight">
              {treesPlanted} ต้น
            </div>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#344012]/10 flex items-center justify-center">
            <Leaf size={32} className="text-[#2B380B]" />
          </div>
        </div>

        {/* Map Title Section */}
        <div>
          <h3 className="text-xs font-bold text-[#5C4B3C] tracking-wide">
            พื้นที่สีเขียวคณะ ICT
          </h3>
          <div className="text-[11px] text-[#8C8276] mt-0.5 mb-2.5">
            แผนที่จุดติดตั้ง
          </div>

          {/* Interactive Stylized Floor Map Card matching Figma */}
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-[#ECEEE0] relative overflow-hidden">
            {/* Map Canvas Frame */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#FBFBF9] border border-[#EBECE1] overflow-hidden">
              {/* Stylized Architectural Floor Lines & Zones */}
              <svg
                className="absolute inset-0 w-full h-full opacity-35"
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Faculty Wall Outlines */}
                <rect x="25" y="25" width="350" height="250" rx="14" stroke="#8C8276" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="140" y1="25" x2="140" y2="180" stroke="#8C8276" strokeWidth="1" />
                <line x1="260" y1="80" x2="260" y2="275" stroke="#8C8276" strokeWidth="1" />
                <line x1="25" y1="180" x2="260" y2="180" stroke="#8C8276" strokeWidth="1" />
                
                {/* Room Labels */}
                <text x="50" y="80" fill="#9E9488" fontSize="11" fontFamily="sans-serif" fontWeight="bold">ZONE A: LOBBY</text>
                <text x="160" y="80" fill="#9E9488" fontSize="11" fontFamily="sans-serif" fontWeight="bold">ZONE B: STAIRS</text>
                <text x="280" y="140" fill="#9E9488" fontSize="11" fontFamily="sans-serif" fontWeight="bold">ZONE C: ELEVATOR</text>
                <text x="80" y="240" fill="#9E9488" fontSize="11" fontFamily="sans-serif" fontWeight="bold">ZONE D: COMMONS</text>
              </svg>

              {/* Plant Pins */}
              {plants.map((plant) => {
                const isSelected = selectedPlant?.id === plant.id;
                return (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    style={{ left: `${plant.x}%`, top: `${plant.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all group ${
                      isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                    }`}
                  >
                    {/* Pulsing ring around selected pin */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-[#B8E348]/40 animate-ping" />
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
                        isSelected
                          ? 'bg-[#89BF2A] text-white ring-2 ring-white ring-offset-1'
                          : 'bg-[#B8E348] text-[#3E4C14]'
                      }`}
                    >
                      <MapPin size={16} fill="currentColor" />
                    </div>
                  </button>
                );
              })}

              {/* Floating Tooltip Callout matching Figma (e.g. "ลิ้นมังกร หน้าลิฟต์ชั้น 1") */}
              {selectedPlant && (
                <div
                  style={{
                    left: `${Math.min(75, Math.max(25, selectedPlant.x))}%`,
                    top: `${Math.max(16, selectedPlant.y - 18)}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full z-40 animate-in fade-in zoom-in-95 pointer-events-none"
                >
                  <div className="bg-[#9E8573] text-white px-3 py-1.5 rounded-xl shadow-lg text-center relative border border-white/20 whitespace-nowrap">
                    <div className="text-[11px] font-bold leading-tight">
                      {selectedPlant.name}
                    </div>
                    <div className="text-[9px] text-[#F3EEEA] leading-tight mt-0.5">
                      {selectedPlant.location}
                    </div>
                    {/* Small speech arrow pointing down */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-5 border-t-[#9E8573]" />
                  </div>
                </div>
              )}
            </div>

            {/* Selected Plant Detail Footer Card */}
            {selectedPlant && (
              <div className="mt-3 p-3 rounded-2xl bg-[#F6F7F0] border border-[#ECEFE2] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shadow-xs shrink-0 bg-[#E8EAE0]">
                    <img
                      src={selectedPlant.bgImage}
                      alt={selectedPlant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#3E342B]">
                      {selectedPlant.name}
                    </div>
                    <div className="text-[10px] text-[#8F8375]">
                      {selectedPlant.location} ({selectedPlant.floor}) • {selectedPlant.co2}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[#72A633] px-2 py-1 bg-[#E7F3D4] rounded-lg">
                  {selectedPlant.status}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
