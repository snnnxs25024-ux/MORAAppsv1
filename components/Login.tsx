
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Box } from 'lucide-react';

interface Props {
  onLogin: (id: string, pass: string) => boolean;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simulate network delay
    setTimeout(() => {
      const success = onLogin(id, pass);
      if (!success) {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-[200] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo & Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[28px] shadow-xl shadow-slate-200/60 border border-slate-100 p-4 mx-auto">
            <img src="https://i.imgur.com/TbEb7Hr.png" alt="Mora" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Mora <span className="text-slate-400 font-light tracking-widest">Systems</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Logistic Terminal Access</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">Selamat Datang</h2>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Silakan masuk menggunakan ID Karyawan Anda untuk mengelola manifest.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* ID Input */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">ID Karyawan</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Contoh: mora"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-mono"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl animate-in shake-x duration-300">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tight">ID atau Password Salah</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0022FF] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Otorisasi Masuk <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center space-y-4">
          <p className="text-[10px] text-slate-400 font-medium">Lupa password? Hubungi <span className="text-blue-600 font-bold underline cursor-pointer">Admin Hub</span></p>
          
          <div className="flex items-center justify-center gap-6 opacity-30 grayscale">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-bold uppercase">Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Box size={14} />
              <span className="text-[9px] font-bold uppercase">Mora 2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
