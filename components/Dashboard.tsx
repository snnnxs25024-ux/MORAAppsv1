import React, { useState, useEffect } from 'react';
import { Package, UserProfile, AppState, DeliveryStatus } from '../types';
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
  Megaphone,
  Zap,
  Clock,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  packages: Package[];
  user: UserProfile;
  appState: AppState;
}

const Dashboard: React.FC<Props> = ({ user, appState, packages }) => {
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

  const totalOnDelivery = packages.filter(p => p.status === DeliveryStatus.PICKED_UP).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16 max-w-md mx-auto">
      {/* Top Header & Notification */}
      <div className="flex items-center justify-between px-1 mt-2">
        <div className="flex items-center gap-2">
          <img src="https://i.imgur.com/TbEb7Hr.png" alt="Mora Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-slate-900 tracking-tight text-lg uppercase">MORA</span>
        </div>
        <button className="relative p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm active:scale-90 transition-all">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* Dynamic Activity Widget - Only shows when clocked in */}
      {appState.isClockedIn && (
        <div className="bg-[#0022FF] p-5 rounded-3xl text-white shadow-xl shadow-blue-700/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
           <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-100">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Status Shift Aktif
                 </div>
                 <h3 className="text-lg font-bold tracking-tight">
                    {appState.currentStep === 'DELIVERING' ? 'Dalam Antaran' : 'Persiapan Muatan'}
                 </h3>
                 <p className="text-[10px] font-medium text-blue-100/80 uppercase">
                    {totalOnDelivery > 0 ? `${totalOnDelivery} Paket Perlu Diantar` : 'Semua Paket Selesai'}
                 </p>
              </div>
              <Link to="/deliveries" className="bg-white/20 backdrop-blur-md p-3 rounded-2xl hover:bg-white/30 transition-all active:scale-95">
                 <Navigation size={20} className="text-white" />
              </Link>
           </div>
        </div>
      )}

      {/* Professional Profile Card */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm shadow-slate-200/40 flex items-center gap-4 relative overflow-hidden transition-all hover:shadow-md">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt="avatar" 
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-lg border-2 border-white shadow-sm">
            <Zap size={10} className="text-white fill-white" />
          </div>
        </div>
        
        <div className="flex-1 space-y-0.5">
          <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">{user.name}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.employeeId}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex -space-x-1">
               {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[6px] font-bold text-blue-600">★</div>)}
            </div>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Pro Partner</span>
          </div>
        </div>

        <Link to="/profile" className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
           <ChevronRight size={18} />
        </Link>
      </div>

      {/* Admin Menu Grid with Micro-Interactions */}
      <div className="grid grid-cols-4 gap-3 px-1">
        {adminMenus.map((menu, idx) => (
          <button key={idx} className="flex flex-col items-center gap-1.5 group active:scale-90 transition-all">
            <div className={`${menu.bg} ${menu.color} p-4 rounded-3xl shadow-sm border-2 border-white group-hover:scale-110 transition-transform duration-300`}>
              {React.cloneElement(menu.icon as React.ReactElement<any>, { size: 20, strokeWidth: 2.5 })}
            </div>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">{menu.label}</span>
          </button>
        ))}
      </div>

      {/* Animated Banner Slider */}
      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Warta & Promo</h3>
           <div className="flex gap-1.5">
              {banners.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${currentBanner === idx ? 'w-5 bg-blue-600' : 'w-1.5 bg-slate-200'}`}></div>
              ))}
           </div>
        </div>
        
        <div className="relative h-44 w-full rounded-[2rem] overflow-hidden shadow-lg border border-slate-100">
          {banners.map((banner, idx) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-out flex items-center p-7 ${currentBanner === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
            >
              <img src={banner.img} className="absolute inset-0 w-full h-full object-cover" alt="banner" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
              
              <div className="relative z-10 text-white space-y-2 mt-auto">
                <h4 className="text-lg font-bold leading-tight tracking-tight">{banner.title}</h4>
                <p className="text-[11px] font-medium text-slate-200 line-clamp-2 leading-relaxed opacity-90">{banner.desc}</p>
                <button className="bg-white text-slate-900 px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase mt-2 shadow-lg shadow-white/20 active:scale-95 transition-all">Lihat Detail</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;