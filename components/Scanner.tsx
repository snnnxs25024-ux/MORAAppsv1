import React, { useState, useRef, useEffect } from 'react';
import { Package, DeliveryStatus, AppState } from '../types';
import { Scan, X, Camera, CheckCircle2, Keyboard, ArrowLeft, Banknote, Package as PackageIcon, Trash2, Info, AlertTriangle } from 'lucide-react';
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
    // Check if duplicate
    const isDuplicate = existingPackages.some(p => p.trackingNumber === resi);
    if (isDuplicate && mode === 'LOAD') {
      alert("Resi ini sudah ada dalam daftar muatan!");
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
        alert("Resi tidak ditemukan dalam daftar muatan!");
      }
    }
  };

  const confirmPackageLoad = (isCod: boolean) => {
    // Validasi kuota paket (Hard Limit)
    if (isCod && scannedCodCount >= appState.expectedCod) {
      setLimitWarning(`Kuota paket COD (${appState.expectedCod}) sudah terpenuhi!`);
      setTimeout(() => setLimitWarning(null), 3000);
      return;
    }
    if (!isCod && scannedNonCodCount >= appState.expectedNonCod) {
      setLimitWarning(`Kuota paket NON-COD (${appState.expectedNonCod}) sudah terpenuhi!`);
      setTimeout(() => setLimitWarning(null), 3000);
      return;
    }

    const newPkg: Package = {
      id: Date.now().toString(),
      trackingNumber: currentScannedResi,
      sender: "Gudang Utama Mora",
      recipient: "Customer Mora",
      address: "Jl. Contoh Alamat No. " + Math.floor(Math.random() * 100),
      status: DeliveryStatus.PICKED_UP,
      timestamp: new Date().toISOString(),
      isCod,
      codAmount: isCod ? parseInt(codAmount || '0') : 0
    };
    onScan(newPkg);
    setScannedResult(currentScannedResi);
    setShowCodSelection(false);
    
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
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col animate-in fade-in duration-300">
      <div className="bg-white p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 rounded-xl text-slate-500 active:scale-95">
            <ArrowLeft size={18} />
        </button>
        <div className="text-center">
            <h1 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
                {mode === 'LOAD' ? 'Proses Loading' : 'Cari Resi'}
            </h1>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Mora Scanner</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col p-5 space-y-5">
        <div className="relative h-80 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-sm shrink-0">
            {limitWarning && (
              <div className="absolute top-4 left-4 right-4 z-20 bg-rose-500 text-white p-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-4">
                <AlertTriangle size={16} />
                <span className="text-[9px] font-semibold uppercase tracking-tight">{limitWarning}</span>
              </div>
            )}

            {!isScanning && !scannedResult && !isManualMode && !showCodSelection && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center space-y-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Camera size={28} className="text-white/30" />
                </div>
                <div className="space-y-3 w-full">
                  <button onClick={startCamera} className="w-full bg-[#0022FF] text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-[10px] shadow-lg shadow-blue-500/20 transition-all">
                    Buka Kamera
                  </button>
                  <button onClick={() => setIsManualMode(true)} className="w-full bg-white/5 text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-[10px] border border-white/10">
                    Input Manual
                  </button>
                </div>
              </div>
            )}

            {isManualMode && !scannedResult && !showCodSelection && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-900 text-white space-y-8 animate-in zoom-in-95">
                 <div className="w-full text-center space-y-3">
                    <label className="text-[9px] font-semibold uppercase tracking-widest opacity-40">Nomor Resi</label>
                    <input 
                      type="text" 
                      autoFocus
                      className="w-full bg-transparent border-b border-[#0022FF]/50 py-3 text-3xl font-semibold text-center outline-none uppercase tracking-tight focus:border-[#0022FF]"
                      placeholder="MORA-XXXX"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-3 w-full">
                    <button onClick={() => setIsManualMode(false)} className="flex-1 py-4 font-semibold uppercase text-[10px] bg-white/5 rounded-xl">Batal</button>
                    <button onClick={() => manualInput.length > 4 && handleInitialScan(manualInput.toUpperCase())} className="flex-[2] py-4 font-semibold uppercase text-[10px] bg-[#0022FF] rounded-xl shadow-lg shadow-blue-500/20">Proses</button>
                 </div>
              </div>
            )}

            {isScanning && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-110" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 border border-white/20 rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-xl"></div>
                    <div className="absolute w-full h-0.5 bg-[#0022FF] opacity-50 shadow-[0_0_15px_#0022FF] animate-pulse mt-28"></div>
                  </div>
                </div>
                <button onClick={stopCamera} className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md text-white p-3 rounded-full border border-white/20"><X size={20} /></button>
                <div className="absolute bottom-8 left-8">
                   <button onClick={() => handleInitialScan(`MORA-${Math.floor(Math.random()*9000)+1000}`)} className="bg-white/90 text-slate-900 px-4 py-2 rounded-xl font-semibold uppercase text-[8px] shadow-sm">Simulasi</button>
                </div>
              </>
            )}

            {showCodSelection && (
              <div className="absolute inset-0 bg-slate-900 p-8 flex flex-col justify-center animate-in slide-in-from-bottom-4">
                <div className="text-center mb-8">
                   <div className="bg-blue-600/10 text-blue-400 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-400/20">
                      <PackageIcon size={24} strokeWidth={1.5} />
                   </div>
                   <h2 className="text-xl font-semibold text-white tracking-tight">{currentScannedResi}</h2>
                   <p className="text-[9px] text-slate-500 font-medium uppercase mt-1 tracking-widest">Identifikasi Layanan Paket</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => confirmPackageLoad(false)}
                        disabled={scannedNonCodCount >= appState.expectedNonCod}
                        className={`flex-1 ${scannedNonCodCount >= appState.expectedNonCod ? 'bg-slate-800 text-slate-600' : 'bg-white/10 hover:bg-white/20 text-white'} py-4 rounded-xl font-semibold uppercase text-[9px] transition-all`}
                      >
                        {scannedNonCodCount >= appState.expectedNonCod ? 'NON-COD PENUH' : 'NON-COD'}
                      </button>
                      <div className="flex-[1.5] flex flex-col gap-2">
                        <div className="relative">
                           <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/70" size={16} />
                           <input 
                            type="number" 
                            placeholder="Nominal Rp"
                            disabled={scannedCodCount >= appState.expectedCod}
                            className={`w-full ${scannedCodCount >= appState.expectedCod ? 'bg-slate-800/50' : 'bg-white/5'} border border-white/10 rounded-xl py-3.5 pl-9 pr-3 text-white font-medium text-xs outline-none focus:border-emerald-500/50`}
                            value={codAmount}
                            onChange={(e) => setCodAmount(e.target.value)}
                           />
                        </div>
                        <button 
                          onClick={() => confirmPackageLoad(true)}
                          disabled={!codAmount || parseInt(codAmount) <= 0 || scannedCodCount >= appState.expectedCod}
                          className="bg-emerald-600 disabled:opacity-30 text-white py-4 rounded-xl font-semibold uppercase text-[9px] shadow-lg shadow-emerald-900/20"
                        >
                          {scannedCodCount >= appState.expectedCod ? 'COD PENUH' : 'PROSES COD'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setShowCodSelection(false); startCamera(); }} className="w-full text-slate-500 font-medium uppercase text-[8px] py-2">Batal Scan</button>
                </div>
              </div>
            )}

            {scannedResult && (
              <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white p-10 text-center animate-in zoom-in-95">
                <div className="bg-white/10 p-5 rounded-full mb-6"><CheckCircle2 size={48} strokeWidth={1.5} /></div>
                <h3 className="text-xl font-semibold uppercase tracking-widest">Tersimpan</h3>
                <div className="mt-4 text-2xl font-semibold bg-black/10 px-6 py-2 rounded-xl tracking-tight">{scannedResult}</div>
              </div>
            )}
        </div>

        {/* Daftar Riwayat Scan Real-time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[9px] font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} className="text-blue-600" /> Riwayat Scan Muatan
            </h4>
            <span className="text-[9px] font-semibold text-slate-400 uppercase">{existingPackages.length} Paket</span>
          </div>

          {existingPackages.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-100 border-dashed text-center">
              <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Belum ada paket yang di-scan</p>
            </div>
          ) : (
            <div className="space-y-2">
              {existingPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${pkg.isCod ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      <PackageIcon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-900 tracking-tight">{pkg.trackingNumber}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${pkg.isCod ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {pkg.isCod ? 'COD' : 'NON-COD'}
                        </span>
                        {pkg.isCod && <span className="text-[8px] font-medium text-slate-400">Rp {pkg.codAmount?.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemove(pkg.id)}
                    className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 shrink-0">
            <h4 className="text-[9px] font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Keyboard size={14} className="text-blue-600" /> Tips Operasional
            </h4>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                    <div className="text-[8px] font-semibold text-slate-400 uppercase mb-0.5">Edit Muatan</div>
                    <p className="text-[9px] font-medium text-slate-600 leading-tight">Gunakan tombol sampah jika salah input.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                    <div className="text-[8px] font-semibold text-slate-400 uppercase mb-0.5">Hard Limit</div>
                    <p className="text-[9px] font-medium text-slate-600 leading-tight">Scan tidak bisa melebihi rencana muatan.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;