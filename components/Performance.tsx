import React from 'react';
import { UserProfile } from '../types';
import { TrendingUp, Award, Target, Star, ChevronRight, Zap, ArrowUpRight, BarChart3, Medal, Trophy, Clock } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Performance: React.FC<Props> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700 pb-16 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performa Kurir</h1>
        <p className="text-slate-400 text-[11px] font-bold px-8 leading-relaxed uppercase tracking-[0.2em]">Analisis Kontribusi Layanan Mora</p>
      </div>

      {/* Premium Main Score Card with Glassmorphism and Gradients */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-[100px] transition-transform duration-1000 group-hover:scale-125"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full -ml-24 -mb-24 blur-[80px]"></div>
        
        <div className="relative z-10 grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
              <Star size={14} className="fill-blue-400" /> Skor Rating
            </div>
            <div className="text-6xl font-bold tracking-tighter tabular-nums flex items-baseline gap-1">
               {user.rating} <span className="text-lg text-slate-500">/5</span>
            </div>
            <div className="text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest text-emerald-400">
              <div className="p-1 bg-emerald-500/20 rounded-md"><TrendingUp size={12} /></div>
              +0.2 Bulan Ini
            </div>
          </div>
          <div className="flex flex-col justify-between items-end">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-5 rounded-[2.5rem] shadow-xl shadow-amber-900/20 ring-4 ring-white/10">
              <Trophy size={40} className="text-white drop-shadow-md" strokeWidth={1.5} />
            </div>
            <div className="text-right space-y-1">
              <div className="text-[10px] font-bold text-amber-300/80 uppercase tracking-widest">Kategori Mitra</div>
              <div className="text-lg font-bold tracking-tight bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">Gold Specialist</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Target Progress Card */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-bold text-slate-800 flex items-center gap-3 uppercase tracking-[0.1em]">
            <Target size={20} className="text-blue-600" /> Progres Target Bulanan
          </h3>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-lg">Juni 2024</span>
        </div>
        
        <div className="space-y-8">
          <div className="group">
            <div className="flex justify-between text-[11px] font-bold mb-4 px-1">
              <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Medal size={14} className="text-blue-500" /> Antaran Sukses
              </span>
              <span className="text-slate-900 tabular-nums">120 <span className="text-slate-200">/</span> 150</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
              <div className="h-full bg-blue-600 rounded-full w-[80%] transition-all duration-1000 shadow-[0_0_12px_rgba(37,99,235,0.4)]"></div>
            </div>
            <p className="text-[9px] font-bold text-blue-600 mt-3 text-right uppercase tracking-widest">30 Paket lagi menuju bonus!</p>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-bold mb-4 px-1">
              <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-emerald-500" /> Ketepatan Waktu
              </span>
              <span className="text-slate-900 tabular-nums">94%</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
              <div className="h-full bg-emerald-500 rounded-full w-[94%] transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Metrics Grid with Glass Backgrounds */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-all group">
          <div className="text-blue-600 bg-blue-50 p-4 rounded-3xl group-hover:scale-110 transition-transform">
             <BarChart3 size={24} strokeWidth={2.5} />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums tracking-tighter">8.5 km</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Jarak</div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-all group">
          <div className="text-amber-600 bg-amber-50 p-4 rounded-3xl group-hover:scale-110 transition-transform">
             <Zap size={24} strokeWidth={2.5} />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums tracking-tighter">42 mnt</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rerata Durasi</div>
        </div>
      </div>

      {/* Achievements List with refined Cards */}
      <div className="space-y-5 px-1">
        <h3 className="text-[10px] font-bold text-slate-400 flex items-center justify-between uppercase tracking-[0.3em]">
          Koleksi Lencana
          <div className="bg-slate-100 p-1.5 rounded-lg"><ChevronRight size={14} className="text-slate-400" /></div>
        </h3>
        <div className="space-y-3 pb-10">
          {[
            { title: "Raja Pick-up", desc: "Berhasil verifikasi 10 paket kilat", date: "Hari ini", icon: <Award size={24} />, color: 'bg-indigo-50 text-indigo-600' },
            { title: "Layanan Prima", desc: "Mendapat review 5 bintang berturut-turut", date: "Kemarin", icon: <Medal size={24} />, color: 'bg-emerald-50 text-emerald-600' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className={`${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { strokeWidth: 2.5 })}
              </div>
              <div className="flex-1">
                <div className="font-bold text-[13px] text-slate-900 tracking-tight">{item.title}</div>
                <div className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{item.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;