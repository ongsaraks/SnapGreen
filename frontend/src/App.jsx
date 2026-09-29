import React, { useState, useEffect } from 'react';
import { Home, Camera, Clock, MapPin } from 'lucide-react';
import LoginView from './components/LoginView';
import HomeView from './components/HomeView';
import ScanView from './components/ScanView';
import HistoryPrizesView from './components/HistoryPrizesView';
import GreenSpaceView from './components/GreenSpaceView';
import { loginStudent, getUserProfile, getFacultyStats, getScanHistory } from './services/api';

const SESSION_KEY = 'snapgreen_student_session';

export default function App() {
  const [studentId, setStudentId] = useState(() => localStorage.getItem(SESSION_KEY) || '');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'scan' | 'history' | 'greenspace'
  const [historySubTab, setHistorySubTab] = useState('history'); // 'history' | 'prizes'
  const [userStats, setUserStats] = useState({ credits: 155, total_scanned: 16 });
  const [facultyStats, setFacultyStats] = useState({ total_scans: 16, trees_planted: 5, next_tree_goal: 28 });
  const [recentScans, setRecentScans] = useState([]);

  // Fetch student and faculty data
  const refreshData = async (sid) => {
    if (!sid) return;
    try {
      const [uData, fData, hData] = await Promise.all([
        getUserProfile(sid).catch(() => null),
        getFacultyStats().catch(() => null),
        getScanHistory(sid).catch(() => []),
      ]);

      if (uData) setUserStats(uData);
      if (fData) setFacultyStats(fData);
      if (hData) setRecentScans(hData);
    } catch (e) {
      console.warn('Error refreshing app data:', e);
    }
  };

  useEffect(() => {
    if (studentId) {
      refreshData(studentId);
    }
  }, [studentId]);

  // Handle student login
  const handleLogin = async (id) => {
    const res = await loginStudent(id);
    setStudentId(res.student_id);
    setUserStats(res);
    localStorage.setItem(SESSION_KEY, res.student_id);
    setActiveTab('home');
    refreshData(res.student_id);
  };

  // Handle student logout
  const handleLogout = () => {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
      setStudentId('');
      localStorage.removeItem(SESSION_KEY);
      setActiveTab('home');
    }
  };

  // Handle points claim from scanner
  const handlePointsClaimed = (claimResult) => {
    if (claimResult?.user) {
      setUserStats(claimResult.user);
    }
    if (claimResult?.faculty_stats) {
      setFacultyStats(claimResult.faculty_stats);
    }
    refreshData(studentId);
  };

  // If not authenticated, render Login screen
  if (!studentId) {
    return (
      <div className="mobile-app-shell">
        <LoginView onLoginSuccess={handleLogin} />
      </div>
    );
  }

  return (
    <div className="mobile-app-shell">
      {/* Active Screen View */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {activeTab === 'home' && (
          <HomeView
            studentId={studentId}
            userStats={userStats}
            facultyStats={facultyStats}
            recentScans={recentScans}
            onOpenScanner={() => setActiveTab('scan')}
            onViewAllHistory={() => {
              setHistorySubTab('history');
              setActiveTab('history');
            }}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'scan' && (
          <ScanView
            studentId={studentId}
            onLogout={handleLogout}
            onPointsClaimed={handlePointsClaimed}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPrizesView
            studentId={studentId}
            userStats={userStats}
            historyScans={recentScans}
            initialSubTab={historySubTab}
            onLogout={handleLogout}
            onUserUpdate={(updated) => setUserStats(updated)}
          />
        )}

        {activeTab === 'greenspace' && (
          <GreenSpaceView
            studentId={studentId}
            userStats={userStats}
            facultyStats={facultyStats}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Dark Brown Bottom Navigation Bar matching Figma design */}
      <nav className="fixed sm:absolute bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-[#5C4B3C] text-white py-2 px-3 flex items-center justify-around z-40 rounded-t-2xl shadow-lg border-t border-white/10">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-[#B8E348]' : 'text-[#C5B8A8] hover:text-white'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] font-medium mt-1">หน้าหลัก</span>
        </button>

        {/* Tab 2: Scan */}
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'scan' ? 'text-[#B8E348]' : 'text-[#C5B8A8] hover:text-white'
          }`}
        >
          <Camera size={20} />
          <span className="text-[10px] font-medium mt-1">สแกน</span>
        </button>

        {/* Tab 3: History */}
        <button
          onClick={() => {
            setHistorySubTab('history');
            setActiveTab('history');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'history' ? 'text-[#B8E348]' : 'text-[#C5B8A8] hover:text-white'
          }`}
        >
          <Clock size={20} />
          <span className="text-[10px] font-medium mt-1">ประวัติ</span>
        </button>

        {/* Tab 4: Green Space */}
        <button
          onClick={() => setActiveTab('greenspace')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'greenspace' ? 'text-[#B8E348]' : 'text-[#C5B8A8] hover:text-white'
          }`}
        >
          <MapPin size={20} />
          <span className="text-[10px] font-medium mt-1">พื้นที่สีเขียว</span>
        </button>
      </nav>
    </div>
  );
}
