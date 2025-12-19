import React, { useState, useRef, useEffect } from 'react';
import { Package, DeliveryStatus, AppState } from '../types';
import { Scan, X, Camera, CheckCircle2, Keyboard, ArrowLeft, Banknote, Package as PackageIcon, Trash2, Info, AlertTriangle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onScan: (pkg: Package) => void;
  onRemove: (id: string) => void;
  mode: 'LOAD' | 'FIND';
  existingPackages: Package[];
  appState: AppState;
}

const Scanner: React.FC<Props> = ({ onScan, onRemove, mode, existingPackages, appState }) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualInput, setManualInput] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  
  const [showCodSelection, setShowCodSelection] = useState(false);
  const [currentScannedResi, setCurrentScannedResi] = useState('');
  const [codAmount, setCodAmount] = useState('');
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  const scannedCodCount = existingPackages.filter(p => p.isCod).length;
  const scannedNonCodCount = existingPackages.filter(p => !p.isCod).length;

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setIsManualMode(false);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Kamera tidak dapat diakses.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const handleInitialScan = (resi: string) => {
    const isDuplicate = existingPackages.some(p => p.trackingNumber === resi);
    if (isDuplicate && mode === 'LOAD') {
      setLimitWarning("Resi ini sudah ada dalam muatan!");
      setTimeout(() => setLimitWarning(null), 3000);
      return;
    }

    if (mode === 'LOAD') {
      setCurrentScannedResi(resi);
      setShowCodSelection(true);
      stopCamera();
    } else {
      const found = existingPackages.find(p => p.trackingNumber === resi);
      if (found) {
        navigate('/deliveries', { state: { search: resi } });
      } else {
        setLimitWarning("Resi tidak terdaftar!");
        setTimeout(() => setLimitWarning(null), 3000);
      }
    }
  };

  const confirmPackageLoad = (isCod: boolean) => {
    if (isCod && scannedCodCount >= appState.expectedCod) {
      setLimitWarning(`Kuota Tunai (${appState.expectedCod}) terpenuhi!`);
      setTimeout(() => setLimitWarning(null), 3000);
      return;
    }
    if (!isCod && scannedNonCodCount >= appState.expectedNonCod) {
      setLimitWarning(`Kuota Non-Tunai (${appState.expectedNonCod}) terpenuhi!`);
      setTimeout(() => setLimitWarning(null), 3000);
      return;
    }

    const newPkg: Package = {
      id: Date.now().toString(),
      trackingNumber: currentScannedResi,
      sender: "Mora Central Hub",
      recipient: "Penerima Mora",
      address: "Alamat Customer No. " + Math.floor(Math.random() * 100),
      status: DeliveryStatus.PICKED_UP,
      timestamp: new Date().toISOString(),
      isCod,
      codAmount: isCod ? parseInt(codAmount || '0') : 0
    };
    onScan(newPkg);
    setScannedResult(currentScannedResi);
    setShowCodSelection(false);
    
    // Feedback haptik visual
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
        setScannedResult(null);
        setManualInput('');
        setIsManualMode(false);
        setCodAmount('');
        if (mode === 'LOAD') startCamera();
    }, 1200);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col animate-in fade-in duration-500">
      <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm relative z-20">
        <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 rounded-2xl text-slate-500 active:scale-90 transition-all">
            <ArrowLeft size={20} />
        </button>
        <div className="text-center">
            <h1 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">
                {mode === 'LOAD' ? 'Verifikasi Muatan' : 'Pencarian Paket'}
            </h1>
            <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Focus Mode Aktif</p>
        </div>
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
           <Zap size={18} fill="currentColor" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col p-6 space-y-6">
        <div className="relative h-96 w-full bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl shrink-0 border-4 border-white">
            {limitWarning && (
              <div className="absolute top-6 left-6 right-6 z-30 bg-rose-500 text-white p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-10 shadow-xl shadow-rose-900/20">
                <AlertTriangle size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{limitWarning}</span>
              </div>
            )}

            {!isScanning && !scannedResult && !isManualMode && !showCodSelection && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border-2 border-white/10 group">
                    <Camera size={40} className="text-white/20 group-hover:scale-110 transition-transform" strokeWidth={1} />
                </div>
                <div className="space-y-4 w-full">
                  <button onClick={startCamera} className="w-full bg-[#0022FF] text-white py-5 rounded-[1.8rem] font-bold uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-blue-500/40 active:scale-95 transition-all">
                    Aktifkan Kamera
                  </button>
                  <button onClick={() => setIsManualMode(true)} className="w-full bg-white/5 text-white py-5 rounded-[1.8rem] font-bold uppercase tracking-[0.2em] text-[10px] border border-white/10 active:scale-95 transition-all">
                    Input Resi Manual
                  </button>
                </div>
              </div>
            )}

            {isManualMode && !scannedResult && !showCodSelection && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-slate-950 text-white space-y-10 animate-in zoom-in-95">
                 <div className="w-full text-center space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">Nomor Tracking Mora</label>
                    <input 
                      type="text" 
                      autoFocus
                      className="w-full bg-transparent border-b-2 border-white/20 py-4 text-4xl font-bold text-center outline-none uppercase tracking-tighter focus:border-blue-600 focus:text-blue-400 transition-all"
                      placeholder="MORA-XXXX"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-4 w-full pt-4">
                    <button onClick={() => setIsManualMode(false)} className="flex-1 py-5 font-bold uppercase text-[10px] tracking-widest bg-white/5 rounded-2xl border border-white/10">Batal</button>
                    <button onClick={() => manualInput.length > 4 && handleInitialScan(manualInput.toUpperCase())} className="flex-[2] py-5 font-bold uppercase text-[10px] tracking-widest bg-[#0022FF] rounded-2xl shadow-xl shadow-blue-500/30 active:scale-95 transition-all">Proses Data</button>
                 </div>
              </div>
            )}

            {isScanning && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover brightness-125 contrast-125" />
                {/* Immersive focus overlay */}
                <div className="absolute inset-0 bg-slate-950/40 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white/30 rounded-[3rem] relative shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-600 rounded-tl-[2rem]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-600 rounded-tr-[2rem]"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-600 rounded-bl-[2rem]"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-600 rounded-br-[2rem]"></div>
                    
                    {/* Scanning animation bar */}
                    <div className="absolute inset-x-4 h-1 bg-blue-500 opacity-60 shadow-[0_0_20px_#3b82f6] animate-[scan_2s_infinite_linear] rounded-full"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-center z-10">
                   <button onClick={() => handleInitialScan(`MORA-${Math.floor(Math.random()*9000)+1000}`)} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl font-bold uppercase text-[8px] tracking-widest">Tes Scan</button>
                   <button onClick={stopCamera} className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full border border-white/20 active:scale-90 transition-all"><X size={24} /></button>
                </div>
              </>
            )}

            {showCodSelection && (
              <div className="absolute inset-0 bg-slate-950 p-10 flex flex-col justify-center animate-in slide-in-from-bottom-10 duration-500">
                <div className="text-center mb-10">
                   <div className="bg-blue-600/10 text-blue-500 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/20 shadow-xl shadow-blue-900/10">
                      <PackageIcon size={32} strokeWidth={2} />
                   </div>
                   <h2 className="text-3xl font-bold text-white tracking-tighter">{currentScannedResi}</h2>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-[0.3em]">Klasifikasi Layanan</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] space-y-6">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => confirmPackageLoad(false)}
                        disabled={scannedNonCodCount >= appState.expectedNonCod}
                        className={`flex-1 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${scannedNonCodCount >= appState.expectedNonCod ? 'bg-slate-800 text-slate-600' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                      >
                        {scannedNonCodCount >= appState.expectedNonCod ? 'PENUH' : 'NON-TUNAI'}
                      </button>
                      <div className="flex-[1.5] flex flex-col gap-3">
                        <div className="relative">
                           <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/80" size={20} />
                           <input 
                            type="number" 
                            placeholder="Input Tagihan Rp"
                            disabled={scannedCodCount >= appState.expectedCod}
                            className={`w-full ${scannedCodCount >= appState.expectedCod ? 'bg-slate-900/50' : 'bg-white/5'} border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white/10 transition-all`}
                            value={codAmount}
                            onChange={(e) => setCodAmount(e.target.value)}
                           />
                        </div>
                        <button 
                          onClick={() => confirmPackageLoad(true)}
                          disabled={!codAmount || parseInt(codAmount) <= 0 || scannedCodCount >= appState.expectedCod}
                          className="bg-emerald-600 disabled:opacity-30 text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
                        >
                          {scannedCodCount >= appState.expectedCod ? 'Penuh' : 'Konfirmasi Tunai'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setShowCodSelection(false); startCamera(); }} className="w-full text-slate-600 font-bold uppercase text-[9px] tracking-widest py-2">Batal Verifikasi</button>
                </div>
              </div>
            )}

            {scannedResult && (
              <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white p-12 text-center animate-in zoom-in-95 duration-500">
                <div className="bg-white/20 p-8 rounded-full mb-8 shadow-2xl animate-bounce"><CheckCircle2 size={64} strokeWidth={2} /></div>
                <h3 className="text-2xl font-bold uppercase tracking-[0.3em] drop-shadow-md">Tersinkron</h3>
                <div className="mt-6 text-3xl font-bold bg-black/10 px-8 py-3 rounded-2xl tracking-tighter border border-white/20">{scannedResult}</div>
              </div>
            )}
        </div>

        {/* History List with Refined Cards */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                <Info size={16} className="text-blue-600" /> Riwayat Muatan
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{existingPackages.length} Paket Terdata</span>
          </div>

          <div className="space-y-3 pb-12">
            {existingPackages.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] border-2 border-slate-50 border-dashed text-center opacity-30">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Pindai Barcode Paket Untuk Menambahkan Muatan</p>
              </div>
            ) : (
              existingPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-4 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-2xl transition-transform group-hover:rotate-12 ${pkg.isCod ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      <PackageIcon size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-slate-900 tracking-tight">{pkg.trackingNumber}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg ${pkg.isCod ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {pkg.isCod ? 'Tunai' : 'Lunas'}
                        </span>
                        {pkg.isCod && <span className="text-[10px] font-bold text-slate-400">Rp {pkg.codAmount?.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemove(pkg.id)}
                    className="p-3.5 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(16px); }
          100% { transform: translateY(240px); }
        }
      `}</style>
    </div>
  );
};

export default Scanner;