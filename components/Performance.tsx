
import React from 'react';
import { UserProfile } from '../types';
import { TrendingUp, Award, Target, Star, ChevronRight, Zap, ArrowUpRight, BarChart3 } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Performance: React.FC<Props> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="flex flex-col items-center text-center space-y-1.5">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Performa Kerja</h1>
        <p className="text-slate-400 text-[11px] font-medium px-8 leading-relaxed uppercase tracking-wider">Statistik Layanan Terverifikasi</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-blue-400 text-[9px] font-semibold uppercase tracking-widest">
              <Star size={12} className="fill-blue-400" /> Rating Aktif
            </div>
            <div className="text-5xl font-semibold tracking-tighter tabular-nums">{user.rating}</div>
            <div className="text-slate-400 text-[9px] font-medium flex items-center gap-1 uppercase tracking-wider">
              <ArrowUpRight size={12} className="text-emerald-400" /> +0.2 bulan ini
            </div>
          </div>
          <div className="flex flex-col justify-end items-end space-y-3">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              <Award size={32} className="text-white/80" strokeWidth={1.5} />
            </div>
            <div className="text-right">
              <div className="text-[9px] font-semibold text-blue-300 uppercase tracking-widest">Kategori Mitra</div>
              <div className="text-sm font-semibold tracking-tight">Gold Specialist</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl"></div>
      </div>

      {/* Target Progress */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
            <Target size={16} className="text-blue-600" /> Target Bulanan
          </h3>
          <span className="text-[9px] font-semibold text-slate-300 uppercase tracking-widest">Juni 2024</span>
        </div>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-[10px] font-medium mb-2.5">
              <span className="text-slate-500 uppercase tracking-wider">Antaran Sukses</span>
              <span className="text-slate-900 font-semibold tabular-nums">120 / 150</span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-blue-600 rounded-full w-[80%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-medium mb-2.5">
              <span className="text-slate-500 uppercase tracking-wider">Ketepatan Waktu</span>
              <span className="text-slate-900 font-semibold tabular-nums">94%</span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-emerald-500 rounded-full w-[94%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-2">
          <div className="text-blue-600/50">
             <BarChart3 size={18} strokeWidth={1.5} />
          </div>
          <div className="text-lg font-semibold text-slate-900 tabular-nums tracking-tight">8.5 km</div>
          <div className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">Jarak Tempuh</div>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-2">
          <div className="text-amber-600/50">
             <Zap size={18} strokeWidth={1.5} />
          </div>
          <div className="text-lg font-semibold text-slate-900 tabular-nums tracking-tight">42 mnt</div>
          <div className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">Durasi Rata-rata</div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4 px-1">
        <h3 className="text-[10px] font-semibold text-slate-800 flex items-center justify-between uppercase tracking-widest">
          Pencapaian Mitra
          <ChevronRight size={14} className="text-slate-300" />
        </h3>
        <div className="space-y-2.5">
          {[
            { title: "Raja Pick-up", desc: "Verifikasi 10 paket tepat waktu", date: "Hari ini" },
            { title: "Layanan Prima", desc: "Mendapat review bintang 5 konsisten", date: "Kemarin" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Award size={20} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[11px] text-slate-900 tracking-tight">{item.title}</div>
                <div className="text-[9px] text-slate-400 font-medium leading-tight">{item.desc}</div>
              </div>
              <div className="text-[8px] font-semibold text-slate-300 uppercase tracking-tighter">{item.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;
