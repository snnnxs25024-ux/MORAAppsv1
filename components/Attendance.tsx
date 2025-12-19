
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  UserCheck, 
  Timer, 
  CheckCircle2, 
  CalendarDays, 
  ChevronRight, 
  Fingerprint, 
  Calendar 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Import types needed for the component props from types.ts
import { AppState, AttendanceData } from '../types';

interface AttendanceRecord {
  date: string;
  timeIn: string;
  timeOut: string;
  status: 'TEPAT_WAKTU' | 'TERLAMBAT';
  day: number;
}

interface Props {
  // Fix: Use appState instead of isClockedIn to match what is passed from App.tsx
  appState: AppState;
  // Fix: onClockIn expects AttendanceData argument as defined in handleClockIn in App.tsx
  onClockIn: (data: AttendanceData) => void;
}

const Attendance: React.FC<Props> = ({ appState, onClockIn }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<string>("Melacak Lokasi...");
  const [activePeriod, setActivePeriod] = useState<1 | 2>(new Date().getDate() <= 15 ? 1 : 2);
  const navigate = useNavigate();

  // Mock data untuk riwayat absensi
  const mockHistory: AttendanceRecord[] = [
    { day: 1, date: '01 JUN 2024', timeIn: '07:55', timeOut: '17:05', status: 'TEPAT_WAKTU' },
    { day: 2, date: '02 JUN 2024', timeIn: '08:10', timeOut: '17:15', status: 'TERLAMBAT' },
    { day: 14, date: '14 JUN 2024', timeIn: '07:50', timeOut: '17:00', status: 'TEPAT_WAKTU' },
    { day: 15, date: '15 JUN 2024', timeIn: '07:58', timeOut: '17:10', status: 'TEPAT_WAKTU' },
    { day: 16, date: '16 JUN 2024', timeIn: '08:05', timeOut: '17:20', status: 'TERLAMBAT' },
    { day: 20, date: '20 JUN 2024', timeIn: '07:45', timeOut: '17:00', status: 'TEPAT_WAKTU' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`Gudang Jakarta Selatan (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
      }, () => setLocation("Area Jakarta Selatan"));
    }
    return () => clearInterval(timer);
  }, []);

  const handleClockPress = () => {
    // Fix: Construct AttendanceData object to satisfy the handleClockIn parameter requirement
    const data: AttendanceData = {
      time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: location,
      photo: 'https://i.imgur.com/8Km9tLL.png'
    };
    onClockIn(data);
    setTimeout(() => navigate('/'), 1200);
  };

  const filteredHistory = mockHistory.filter(item => 
    activePeriod === 1 ? item.day <= 15 : item.day > 15
  );

  const totalWorkingDays = filteredHistory.length;
  const onTimeCount = filteredHistory.filter(h => h.status === 'TEPAT_WAKTU').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 max-w-md mx-auto">
      {/* Header Halaman */}
      <div className="text-center space-y-1 pt-4">
        <h1 className="text-lg font-semibold text-slate-900 uppercase tracking-tight">Absensi</h1>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em]">Sistem Verifikasi Kurir Mora</p>
      </div>

      {/* Card Jam Digital & Tombol Utama */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="text-4xl font-semibold text-slate-900 tracking-tight tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="inline-flex items-center gap-2 text-slate-400 font-medium uppercase tracking-wider text-[10px] bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
            <Calendar size={12} className="text-blue-600" />
            {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#0022FF] font-medium text-[10px] uppercase tracking-tight bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100/50">
          <MapPin size={12} /> {location}
        </div>

        {/* Fix: Access isClockedIn from appState */}
        {appState.isClockedIn ? (
          <div className="w-full bg-emerald-50 text-emerald-600 p-6 rounded-2xl border border-emerald-100 animate-in zoom-in-95">
             <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle2 size={24} />
             </div>
             <h3 className="font-semibold text-xs uppercase tracking-wider">Absensi Berhasil</h3>
             <p className="text-[9px] font-medium opacity-70 mt-0.5">Shift Anda Sedang Berjalan</p>
          </div>
        ) : (
          <button 
            onClick={handleClockPress}
            className="group relative w-40 h-40 rounded-full bg-slate-900 flex flex-col items-center justify-center transition-all active:scale-95 shadow-lg"
          >
            <div className="absolute inset-0 rounded-full bg-[#0022FF] opacity-10 blur-xl group-active:opacity-20 animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/90">
                <Fingerprint size={32} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-[10px] text-white uppercase tracking-[0.1em]">Absen Masuk</span>
            </div>
          </button>
        )}
      </div>

      {/* Bagian Riwayat Berdasarkan Periode */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h2 className="text-[10px] font-semibold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
            <Timer size={14} className="text-[#0022FF]" /> Rekap Absensi
          </h2>
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
             <button 
                onClick={() => setActivePeriod(1)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-semibold uppercase transition-all ${activePeriod === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
             >
                1 - 15
             </button>
             <button 
                onClick={() => setActivePeriod(2)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-semibold uppercase transition-all ${activePeriod === 2 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
             >
                16 - Akhir
             </button>
          </div>
        </div>

        {/* Ringkasan Periode */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#0022FF]">
                 <CalendarDays size={18} />
              </div>
              <div>
                 <div className="text-[13px] font-semibold text-slate-900">{totalWorkingDays} Hari</div>
                 <div className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Total Kerja</div>
              </div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                 <CheckCircle2 size={18} />
              </div>
              <div>
                 <div className="text-[13px] font-semibold text-slate-900">{onTimeCount} Hari</div>
                 <div className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Tepat Waktu</div>
              </div>
           </div>
        </div>

        {/* Daftar Riwayat */}
        <div className="space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center space-y-2 opacity-60">
               <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <CalendarDays size={24} />
               </div>
               <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Belum Ada Data</p>
            </div>
          ) : (
            filteredHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-xs ${item.status === 'TEPAT_WAKTU' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    {item.day}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs uppercase tracking-tight">{item.date}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className={`text-[7px] font-semibold uppercase px-2 py-0.5 rounded-full ${item.status === 'TEPAT_WAKTU' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.status.replace('_', ' ')}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-slate-900 tabular-nums">{item.timeIn} - {item.timeOut}</div>
                  <div className="text-[7px] font-medium text-slate-400 uppercase tracking-widest">Shift Kerja</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
