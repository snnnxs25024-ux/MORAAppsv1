
import React from 'react';
import { UserProfile } from '../types';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Star, 
  Package, 
  Wallet,
  Settings,
  ChevronRight,
  Bell
} from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Profile: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="h-28 bg-slate-900 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-lg border-2 border-white">
                <ShieldCheck size={12} className="text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-14 pb-6 px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{user.name}</h1>
            <p className="text-blue-600 font-medium text-xs flex items-center gap-1">
              {user.employeeId} <span className="text-slate-200 mx-1.5">•</span> Mitra Kurir Mora
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-medium mt-3 uppercase tracking-wider">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-300" /> Jakarta Selatan</span>
              <span className="flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500" /> {user.rating} Review</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-50 text-slate-600 p-2.5 rounded-xl border border-slate-100 active:scale-95 transition-all">
              <Settings size={18} />
            </button>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 active:scale-95 transition-all">
              <Award size={16} strokeWidth={1.5} /> Capaian
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-50 divide-y md:divide-y-0 md:divide-x divide-slate-50">
          <div className="p-5 flex items-center gap-4">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
              <Package size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Antar</div>
              <div className="text-base font-semibold text-slate-900 tabular-nums">{user.totalDeliveries}</div>
            </div>
          </div>
          <div className="p-5 flex items-center gap-4">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
              <Wallet size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Saldo Dompet</div>
              <div className="text-base font-semibold text-slate-900 tabular-nums">Rp {user.balance.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-5 flex items-center gap-4">
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600">
              <Bell size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Notifikasi</div>
              <div className="text-base font-semibold text-slate-900 tabular-nums">12</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-5 uppercase tracking-wider">Info Kontak</h3>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Nomor Ponsel</div>
                <div className="text-slate-800 font-medium text-xs">{user.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Email Terdaftar</div>
                <div className="text-slate-800 font-medium text-xs">{user.email}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider px-1">Privasi & Akun</h3>
          <div className="space-y-1">
            {[
              "Verifikasi Wajah (KYC)",
              "Keamanan & Password",
              "Pengaturan Pengiriman",
              "Pusat Bantuan & Tiket"
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-all text-slate-700 font-medium text-xs group">
                {item}
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
