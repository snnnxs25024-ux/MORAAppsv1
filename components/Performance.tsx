
import React from 'react';
import { UserProfile } from '../types';
import { TrendingUp, Award, Target, Star, ChevronRight, Zap, ArrowUpRight, BarChart3 } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Performance: React.FC<Props> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="flex flex-col items-center text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Performa Kerja</h1>
        <p className="text-slate-500 text-sm px-8">Pantau statistik pengiriman dan kualitas layanan Anda secara real-time.</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Star size={14} className="fill-indigo-400" /> Rating Saat Ini
            </div>
            <div className="text-6xl font-black">{user.rating}</div>
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <ArrowUpRight size={14} className="text-emerald-400" /> +0.2 bulan ini
            </div>
          </div>
          <div className="flex flex-col justify-end items-end space-y-2">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl">
              <Award size={40} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-indigo-300">Level Kurir</div>
              <div className="text-lg font-bold">Gold Specialist</div>
            </div>
          </div>
        </div>
        {/* Abstract Glow */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Target Progress */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Target size={20} className="text-indigo-600" /> Target Bulanan
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Juni 2024</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 font-medium">Pengiriman Sukses</span>
              <span className="text-slate-900 font-bold">120/150</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-[80%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 font-medium">On-Time Delivery</span>
              <span className="text-slate-900 font-bold">94%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[94%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100 flex flex-col items-center text-center space-y-2">
          <div className="bg-blue-600 text-white p-3 rounded-2xl">
             <BarChart3 size={20} />
          </div>
          <div className="text-xl font-bold text-slate-900">8.5 km</div>
          <div className="text-[10px] font-bold text-blue-600 uppercase">Jarak Tempuh</div>
        </div>
        <div className="bg-amber-50/50 p-6 rounded-[2.5rem] border border-amber-100 flex flex-col items-center text-center space-y-2">
          <div className="bg-amber-500 text-white p-3 rounded-2xl">
             <Zap size={20} />
          </div>
          <div className="text-xl font-bold text-slate-900">42 menit</div>
          <div className="text-[10px] font-bold text-amber-600 uppercase">Waktu Rata-rata</div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 px-2 flex items-center justify-between">
          Pencapaian Baru
          <ChevronRight size={18} className="text-slate-300" />
        </h3>
        <div className="space-y-3">
          {[
            { title: "Raja Pick-up", desc: "Berhasil 10 pick-up tepat waktu", date: "Hari ini" },
            { title: "Kurir Ramah", desc: "Mendapat 5 bintang berturut-turut", date: "Kemarin" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Award size={24} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;
