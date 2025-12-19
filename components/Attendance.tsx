
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, UserCheck, Timer, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isClockedIn: boolean;
  onClockIn: () => void;
}

const Attendance: React.FC<Props> = ({ isClockedIn, onClockIn }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<string>("Melacak...");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
      }, () => setLocation("Area Jakarta"));
    }
    return () => clearInterval(timer);
  }, []);

  const handleClockPress = () => {
    onClockIn();
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold text-slate-900 uppercase tracking-widest">Presensi</h1>
        <p className="text-[9px] text-slate-400 font-bold uppercase">Verifikasi Waktu & Lokasi</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6">
        <div className="text-5xl font-bold text-slate-900 tracking-tighter tabular-nums">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        
        <div className="text-slate-400 font-bold uppercase tracking-widest text-[9px] bg-slate-50 px-4 py-1.5 rounded-full">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>

        <div className="flex items-center gap-1.5 text-indigo-600 font-bold uppercase text-[9px]">
          <MapPin size={14} /> {location}
        </div>

        {isClockedIn ? (
          <div className="bg-emerald-50 text-emerald-600 p-6 rounded-xl border border-emerald-100 w-full">
             <CheckCircle2 size={32} className="mx-auto mb-2" />
             <h3 className="font-bold text-sm uppercase">Absen Sukses</h3>
          </div>
        ) : (
          <button 
            onClick={handleClockPress}
            className="w-full bg-slate-900 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-md"
          >
            <UserCheck size={32} />
            <span className="font-bold text-sm uppercase tracking-widest">Masuk Tugas</span>
          </button>
        )}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-[10px] font-bold text-slate-800 flex items-center gap-2 uppercase">
          <Timer size={16} className="text-indigo-600" /> Riwayat
        </h2>
        <div className="space-y-3">
          {['Senin', 'Selasa'].map((day, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-white">
              <div>
                <div className="font-bold text-slate-900 text-xs uppercase">{day}</div>
                <div className="text-[9px] text-slate-400 font-medium">12 JUNI 2024</div>
              </div>
              <div className="text-right text-[10px] font-bold text-indigo-600">07:58 - 17:05</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
