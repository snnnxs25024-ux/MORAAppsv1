
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-32 bg-indigo-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-2 border-white">
                <ShieldCheck size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-indigo-600 font-semibold text-sm flex items-center gap-1">
              {user.employeeId} <span className="text-slate-300 mx-2">•</span> Mitra Kurir Mora
            </p>
            <div className="flex items-center gap-4 text-slate-500 text-sm mt-3">
              <span className="flex items-center gap-1"><MapPin size={14} /> Jakarta Selatan</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /> {user.rating} (250+ review)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-100 text-slate-700 p-3 rounded-xl hover:bg-slate-200 transition-colors">
              <Settings size={20} />
            </button>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
              <Award size={20} /> Lihat Pencapaian
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-6 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Pengiriman Sukses</div>
              <div className="text-xl font-bold text-slate-900">{user.totalDeliveries}</div>
            </div>
          </div>
          <div className="p-6 flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Wallet className="text-emerald-600" size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Saldo Dompet</div>
              <div className="text-xl font-bold text-slate-900">Rp {user.balance.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-6 flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-xl">
              <Bell className="text-amber-600" size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Notifikasi Aktif</div>
              <div className="text-xl font-bold text-slate-900">12</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Informasi Kontak</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-500">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">No. Telepon</div>
                <div className="text-slate-800 font-medium">{user.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-500">
                <Mail size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email</div>
                <div className="text-slate-800 font-medium">{user.email}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pengaturan Akun</h3>
          <div className="space-y-2">
            {[
              "Verifikasi Wajah (KYC)",
              "Keamanan & Password",
              "Pengaturan Pengiriman",
              "Pusat Bantuan & Tiket"
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-slate-700 font-medium">
                {item}
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
