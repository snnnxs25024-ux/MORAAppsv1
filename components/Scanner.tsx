
import React, { useState, useRef, useEffect } from 'react';
import { Package, DeliveryStatus } from '../types';
import { Scan, X, Camera, CheckCircle2, Keyboard, ArrowLeft, Banknote, Package as PackageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onScan: (pkg: Package) => void;
  mode: 'LOAD' | 'FIND';
  existingPackages: Package[];
}

const Scanner: React.FC<Props> = ({ onScan, mode, existingPackages }) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualInput, setManualInput] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  
  // COD Selection Modal state
  const [showCodSelection, setShowCodSelection] = useState(false);
  const [currentScannedResi, setCurrentScannedResi] = useState('');
  const [codAmount, setCodAmount] = useState('');

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
    if (mode === 'LOAD') {
      setCurrentScannedResi(resi);
      setShowCodSelection(true);
      stopCamera();
    } else {
      // mode FIND
      const found = existingPackages.find(p => p.trackingNumber === resi);
      if (found) {
        navigate('/deliveries', { state: { search: resi } });
      } else {
        alert("Resi tidak ditemukan dalam daftar muatan!");
      }
    }
  };

  const confirmPackageLoad = (isCod: boolean) => {
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
        if (mode === 'LOAD') {
          startCamera();
        }
    }, 1200);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col animate-in fade-in duration-500">
      <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 rounded-2xl text-slate-500 active:scale-90">
            <ArrowLeft size={20} />
        </button>
        <div className="text-center">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {mode === 'LOAD' ? 'Proses Loading' : 'Cari Resi'}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mora Scanner</p>
        </div>
        <div className="w-11"></div>
      </div>

      <div className="flex-1 relative flex flex-col p-6 space-y-6">
        <div className="relative flex-1 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
            {!isScanning && !scannedResult && !isManualMode && !showCodSelection && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <Camera size={40} className="text-white/40" />
                </div>
                <div className="space-y-4 w-full">
                  <button onClick={startCamera} className="w-full bg-[#0022FF] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl">
                    Buka Kamera
                  </button>
                  <button onClick={() => setIsManualMode(true)} className="w-full bg-white/10 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] border border-white/10">
                    Input Manual
                  </button>
                </div>
              </div>
            )}

            {isManualMode && !scannedResult && !showCodSelection && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-slate-800 text-white space-y-8 animate-in zoom-in-95">
                 <div className="w-full text-center space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Nomor Resi</label>
                    <input 
                      type="text" 
                      autoFocus
                      className="w-full bg-transparent border-b-4 border-[#0022FF] py-4 text-4xl font-black text-center outline-none uppercase tracking-tighter"
                      placeholder="MORA-XXXX"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-4 w-full">
                    <button onClick={() => setIsManualMode(false)} className="flex-1 py-4 font-black uppercase text-[10px] bg-white/5 rounded-2xl">Batal</button>
                    <button onClick={() => manualInput.length > 4 && handleInitialScan(manualInput.toUpperCase())} className="flex-[2] py-4 font-black uppercase text-[10px] bg-[#0022FF] rounded-2xl shadow-xl">Proses</button>
                 </div>
              </div>
            )}

            {isScanning && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale contrast-125" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-[#0022FF]/30 rounded-[3rem] relative">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-[1.5rem]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-[1.5rem]"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-[1.5rem]"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-[1.5rem]"></div>
                    <div className="absolute w-full h-1 bg-[#0022FF] shadow-[0_0_20px_#0022FF] animate-bounce mt-32"></div>
                  </div>
                </div>
                <button onClick={stopCamera} className="absolute bottom-10 right-10 bg-white/20 backdrop-blur-md text-white p-4 rounded-full"><X size={24} /></button>
                <div className="absolute bottom-10 left-10">
                   <button onClick={() => handleInitialScan(`MORA-${Math.floor(Math.random()*9000)+1000}`)} className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black uppercase text-[9px] shadow-2xl">Simulasi</button>
                </div>
              </>
            )}

            {showCodSelection && (
              <div className="absolute inset-0 bg-slate-900 p-8 flex flex-col justify-center animate-in slide-in-from-bottom-5">
                <div className="text-center mb-8">
                   <div className="bg-[#0022FF]/10 text-[#0022FF] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#0022FF]/20">
                      <PackageIcon size={32} />
                   </div>
                   <h2 className="text-xl font-black text-white uppercase tracking-tighter">{currentScannedResi}</h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Pilih Jenis Layanan Paket Ini</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => confirmPackageLoad(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-black uppercase text-[10px] transition-all"
                      >
                        NON COD
                      </button>
                      <div className="flex-[1.5] flex flex-col gap-2">
                        <div className="relative">
                           <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                           <input 
                            type="number" 
                            placeholder="Nominal Rp"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white font-bold text-sm outline-none focus:border-emerald-500"
                            value={codAmount}
                            onChange={(e) => setCodAmount(e.target.value)}
                           />
                        </div>
                        <button 
                          onClick={() => confirmPackageLoad(true)}
                          disabled={!codAmount || parseInt(codAmount) <= 0}
                          className="bg-emerald-600 disabled:opacity-20 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg"
                        >
                          PROSES COD
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setShowCodSelection(false); startCamera(); }} className="w-full text-slate-500 font-bold uppercase text-[9px] py-4">Batal Scan</button>
                </div>
              </div>
            )}

            {scannedResult && (
              <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white p-10 text-center animate-in zoom-in-95">
                <div className="bg-white/20 p-6 rounded-full mb-6 animate-bounce"><CheckCircle2 size={64} /></div>
                <h3 className="text-2xl font-black uppercase tracking-widest">Tersimpan</h3>
                <div className="mt-4 text-3xl font-black bg-black/10 px-6 py-3 rounded-2xl tracking-tighter">{scannedResult}</div>
              </div>
            )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Keyboard size={16} className="text-[#0022FF]" /> Tips Scanning
            </h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">COD</div>
                    <p className="text-[10px] font-bold text-slate-600 leading-tight">Pastikan nominal uang sesuai resi fisik.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Data</div>
                    <p className="text-[10px] font-bold text-slate-600 leading-tight">Gunakan input manual jika barcode rusak.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
