
import React, { useState, useEffect } from 'react';
import { Package, UserProfile, AppState } from '../types';
import { 
  Bell, 
  HeartPulse, 
  CreditCard, 
  ReceiptText, 
  LifeBuoy, 
  ShieldCheck, 
  GraduationCap, 
  ChevronRight,
  ShieldAlert,
  Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  packages: Package[];
  user: UserProfile;
  appState: AppState;
}

const Dashboard: React.FC<Props> = ({ user }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const banners = [
    {
      id: 1,
      title: "Promo Ramadhan",
      desc: "Kejar insentif tambahan hingga 20% minggu ini!",
      bg: "bg-blue-600",
      img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      title: "Safety First",
      desc: "Gunakan perlengkapan safety lengkap saat bertugas.",
      bg: "bg-slate-800",
      img: "https://images.unsplash.com/photo-1506469717960-433cebe3f181?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      title: "Update Aplikasi",
      desc: "Nikmati fitur scan lebih cepat di versi v2.4.1",
      bg: "bg-emerald-600",
      img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=400"
    }
  ];

  const adminMenus = [
    { icon: <HeartPulse size={20} />, label: 'BPJS', color: 'text-rose-500', bg: 'bg-rose-50' },
    { icon: <CreditCard size={20} />, label: 'Klaim', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: <ReceiptText size={20} />, label: 'Slip Gaji', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: <LifeBuoy size={20} />, label: 'Bantuan', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: <ShieldCheck size={20} />, label: 'Keamanan', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { icon: <GraduationCap size={20} />, label: 'Training', color: 'text-violet-500', bg: 'bg-violet-50' },
    { icon: <ShieldAlert size={20} />, label: 'Lapor', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: <Megaphone size={20} />, label: 'Info', color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 max-w-md mx-auto">
      {/* Top Header & Notification */}
      <div className="flex items-center justify-between px-1 mt-2">
        <div className="flex items-center gap-2">
          <img src="https://i.imgur.com/TbEb7Hr.png" alt="Mora Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-slate-900 tracking-tighter text-xl">MORA</span>
        </div>
        <button className="relative p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm active:scale-90 transition-all">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* Professional Profile Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-200/50 flex items-center gap-4 relative overflow-hidden">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt="avatar" 
            className="w-16 h-16 rounded-xl object-cover ring-4 ring-slate-50 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1 rounded-lg border-2 border-white">
            <ShieldCheck size={12} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1 space-y-0.5">
          <h2 className="text-base font-bold text-slate-800 tracking-tight leading-none">{user.name}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.employeeId}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kurir Utama • Aktif</span>
          </div>
        </div>

        <Link to="/profile" className="p-2 text-slate-300">
           <ChevronRight size={20} />
        </Link>
        
        {/* Subtle decorative background element */}
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-50 rounded-full opacity-50"></div>
      </div>

      {/* Admin Menu Grid */}
      <div className="grid grid-cols-4 gap-4 px-1">
        {adminMenus.map((menu, idx) => (
          <button key={idx} className="flex flex-col items-center gap-2 group active:scale-95 transition-all">
            <div className={`${menu.bg} ${menu.color} p-3.5 rounded-2xl shadow-sm border border-white group-hover:shadow-md transition-all`}>
              {menu.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{menu.label}</span>
          </button>
        ))}
      </div>

      {/* Animated Banner Slider */}
      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between">
           <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Informasi Terkini</h3>
           <div className="flex gap-1">
              {banners.map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${currentBanner === idx ? 'w-4 bg-blue-600' : 'w-1 bg-slate-200'}`}></div>
              ))}
           </div>
        </div>
        
        <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100">
          {banners.map((banner, idx) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center p-6 ${currentBanner === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
            >
              <img src={banner.img} className="absolute inset-0 w-full h-full object-cover" alt="banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              
              <div className="relative z-10 text-white space-y-2 max-w-[70%]">
                <h4 className="text-lg font-bold leading-tight tracking-tight">{banner.title}</h4>
                <p className="text-[10px] font-medium text-slate-200 line-clamp-2 leading-relaxed">{banner.desc}</p>
                <button className="bg-white text-slate-900 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase mt-2 shadow-lg">Lihat Detail</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Task Shortcut (Minor) */}
      <Link to="/deliveries" className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-white/10 rounded-xl text-blue-400">
              <ShieldAlert size={18} />
           </div>
           <div>
              <p className="text-white text-[11px] font-bold tracking-tight">Cek Tugas Hari Ini</p>
              <p className="text-slate-400 text-[9px] font-medium uppercase tracking-widest">3 paket perlu diantar</p>
           </div>
        </div>
        <ChevronRight size={16} className="text-slate-500" />
      </Link>
    </div>
  );
};

export default Dashboard;
