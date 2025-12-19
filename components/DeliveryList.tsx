
import React, { useState, useEffect } from 'react';
import { Package, DeliveryStatus, AppState } from '../types';
import { 
  Package as PackageIcon, 
  Search, 
  MapPin, 
  X, 
  Camera, 
  User, 
  Scan, 
  CheckCircle2, 
  Banknote, 
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Truck,
  UserCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  packages: Package[];
  onUpdate: (id: string, status: DeliveryStatus, data?: { recipientName?: string, proofImage?: string, cancelReason?: string }) => void;
  appState: AppState;
  onSetupTotal: (cod: number, nonCod: number) => void;
  onFinishLoading: () => void;
  onStartHandover: () => void;
  onCompleteHandover: (photo: string, leader: string) => void;
  onReset: () => void;
}

const DeliveryList: React.FC<Props> = ({ 
  packages, onUpdate, appState, onSetupTotal, onFinishLoading, onStartHandover, onCompleteHandover, onReset 
}) => {
  const location = useLocation();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [codInput, setCodInput] = useState('');
  const [nonCodInput, setNonCodInput] = useState('');
  const [handoverLeader, setHandoverLeader] = useState('');
  const [handoverPhoto, setHandoverPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.search) setSearchQuery(location.state.search);
  }, [location.state]);

  const scannedCod = packages.filter(p => p.isCod).length;
  const scannedNonCod = packages.filter(p => !p.isCod).length;
  const isSync = scannedCod === appState.expectedCod && scannedNonCod === appState.expectedNonCod;

  const filteredPackages = packages.filter(p => 
    p.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (a.status === DeliveryStatus.PICKED_UP && b.status !== DeliveryStatus.PICKED_UP) return -1;
    if (a.status !== DeliveryStatus.PICKED_UP && b.status === DeliveryStatus.PICKED_UP) return 1;
    return 0;
  });

  const handleFinishDelivery = () => {
    if (selectedPkg && recipientName) {
      onUpdate(selectedPkg.id, DeliveryStatus.DELIVERED, {
        recipientName,
        proofImage: 'https://picsum.photos/seed/proof/600/400'
      });
      setShowProofModal(false);
      setSelectedPkg(null);
      setRecipientName('');
    }
  };

  const handleCancelDelivery = () => {
    if (selectedPkg && cancelReason) {
      onUpdate(selectedPkg.id, DeliveryStatus.PENDING, {
        cancelReason
      });
      setShowCancelModal(false);
      setSelectedPkg(null);
      setCancelReason('');
    }
  };

  const renderContent = () => {
    if (!appState.isClockedIn) {
      return (
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95 mt-8">
          <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center text-amber-500 mx-auto border-2 border-white shadow-sm">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold text-base uppercase tracking-tight">Perlu Absensi</h3>
            <p className="text-slate-400 text-[10px] font-medium mt-1 leading-relaxed px-4">Lakukan absensi untuk memulai shift dan melihat tugas harian Anda.</p>
          </div>
          <Link to="/attendance" className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-4 rounded-xl font-medium uppercase tracking-wider text-[10px] shadow-sm active:scale-95 transition-all">
            Halaman Absensi <ArrowRight size={14} />
          </Link>
        </div>
      );
    }

    if (appState.currentStep === 'SETUP_TOTAL') {
      return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 mt-4">
          <div className="px-1">
             <h1 className="text-lg font-semibold text-slate-900 uppercase tracking-tight">Rencana Muatan</h1>
             <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-widest">Tahap 1: Input Estimasi Barang</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-semibold text-slate-400 uppercase ml-1 tracking-widest">Paket COD</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-2xl font-semibold text-slate-900 focus:border-blue-600 outline-none transition-all"
                  value={codInput}
                  onChange={(e) => setCodInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-semibold text-slate-400 uppercase ml-1 tracking-widest">NON-COD</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-2xl font-semibold text-slate-900 focus:border-blue-600 outline-none transition-all"
                  value={nonCodInput}
                  onChange={(e) => setNonCodInput(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={() => onSetupTotal(parseInt(codInput || '0'), parseInt(nonCodInput || '0'))}
              disabled={(parseInt(codInput || '0') + parseInt(nonCodInput || '0') <= 0)}
              className="w-full bg-[#0022FF] text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-[10px] shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-30 transition-all"
            >
              Konfirmasi & Mulai Scan
            </button>
          </div>
        </div>
      );
    }

    if (appState.currentStep === 'LOADING_SCAN') {
      return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 mt-4">
          <div className="px-1">
             <h1 className="text-lg font-semibold text-slate-900 uppercase tracking-tight">Verifikasi Muatan</h1>
             <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-widest">Tahap 2: Sinkronisasi Fisik Paket</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm space-y-6">
            <div className="flex justify-between items-center px-1">
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest ${isSync ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                {isSync ? 'Data Sinkron' : 'Menunggu Sinkron...'}
              </div>
              <div className="text-[9px] font-semibold text-slate-300 uppercase">Jumlah: {packages.length}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <div className="text-[8px] font-semibold text-slate-400 uppercase mb-2 tracking-widest">Layanan COD</div>
                  <div className="text-xl font-semibold text-slate-900 tabular-nums">{scannedCod} <span className="text-slate-200">/</span> {appState.expectedCod}</div>
               </div>
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <div className="text-[8px] font-semibold text-slate-400 uppercase mb-2 tracking-widest">NON-COD</div>
                  <div className="text-xl font-semibold text-slate-900 tabular-nums">{scannedNonCod} <span className="text-slate-200">/</span> {appState.expectedNonCod}</div>
               </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link to="/scan" className="flex-[2] flex items-center justify-center gap-2.5 bg-slate-900 text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-[10px] active:scale-95 transition-all">
                <Scan size={18} strokeWidth={1.5} /> Mulai Scan
              </Link>
              <button 
                onClick={onFinishLoading}
                disabled={!isSync}
                className="flex-1 bg-[#0022FF] text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-[10px] disabled:opacity-30 active:scale-95 shadow-lg shadow-blue-500/20"
              >
                Mulai Antar
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (appState.currentStep === 'DELIVERING') {
      return (
        <div className="space-y-5 animate-in slide-in-from-right-2 duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <div>
                  <h1 className="text-lg font-semibold text-slate-900 uppercase tracking-tight">Daftar Antaran</h1>
                  <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-widest">Monitoring Tugas Aktif</p>
               </div>
               <button onClick={onStartHandover} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 active:scale-90">
                 <RotateCcw size={18} />
               </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari Resi atau Alamat..." 
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-medium focus:ring-4 focus:ring-blue-500/5 outline-none shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/scan" className="bg-[#0022FF] text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                <Scan size={20} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredPackages.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center space-y-3 border border-slate-50 shadow-sm opacity-60">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <PackageIcon size={32} strokeWidth={1.5} />
                 </div>
                 <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Daftar Kosong</p>
              </div>
            ) : (
              filteredPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  onClick={() => (pkg.status !== DeliveryStatus.DELIVERED && pkg.status !== DeliveryStatus.PENDING) && setSelectedPkg(pkg)}
                  className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all active:scale-[0.99] 
                    ${(pkg.status === DeliveryStatus.DELIVERED || pkg.status === DeliveryStatus.PENDING) ? 'opacity-50 grayscale bg-slate-50/50' : 'cursor-pointer hover:border-blue-100'}`}
                >
                  <div className={`p-4 rounded-xl shrink-0 ${
                    pkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-50 text-emerald-500' : 
                    pkg.status === DeliveryStatus.PENDING ? 'bg-amber-50 text-amber-500' :
                    'bg-blue-50 text-[#0022FF]'
                  }`}>
                    <PackageIcon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-xs tracking-tight">{pkg.trackingNumber}</span>
                        {pkg.isCod && (
                          <span className="flex items-center gap-1 text-[8px] font-semibold text-emerald-600 mt-0.5">
                            <Banknote size={10} /> Rp {pkg.codAmount?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className={`text-[7px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        pkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-500 text-white' : 
                        pkg.status === DeliveryStatus.PENDING ? 'bg-amber-500 text-white' : 
                        'bg-[#0022FF] text-white'
                      }`}>
                        {pkg.status === DeliveryStatus.PICKED_UP ? 'Ready' : pkg.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                      <MapPin size={10} className="shrink-0 text-slate-300" />
                      <span className="truncate uppercase tracking-tight">{pkg.address}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    if (appState.currentStep === 'HANDOVER') {
      const pendingPackages = packages.filter(p => p.status === DeliveryStatus.PENDING);
      return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 animate-in zoom-in-95 mt-4">
          <div className="text-center">
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">Penyelesaian Shift</h3>
            <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-widest">Pengembalian {pendingPackages.length} Paket Ke Gudang</p>
          </div>

          <div className="space-y-6">
            <div 
              onClick={() => setHandoverPhoto('https://picsum.photos/seed/handover/600/400')}
              className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${handoverPhoto ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}
            >
              {handoverPhoto ? (
                <img src={handoverPhoto} className="w-full h-full object-cover rounded-xl" alt="Proof" />
              ) : (
                <>
                  <Camera size={32} className="text-slate-300" strokeWidth={1.5} />
                  <span className="text-[10px] font-semibold uppercase text-slate-400 mt-2">Foto Serah Terima</span>
                </>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-widest">Petugas Gudang</label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Nama Leader / Admin"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                  value={handoverLeader}
                  onChange={(e) => setHandoverLeader(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => onCompleteHandover(handoverPhoto || '', handoverLeader)}
            disabled={!handoverPhoto || !handoverLeader}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-[10px] active:scale-95 disabled:opacity-30 transition-all"
          >
            Konfirmasi Penyelesaian
          </button>
        </div>
      );
    }

    if (appState.currentStep === 'COMPLETED') {
      return (
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm text-center space-y-8 animate-in fade-in mt-4">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center text-emerald-600 mx-auto border-2 border-white shadow-sm">
            <UserCheck size={36} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 uppercase tracking-tight">Shift Berakhir</h3>
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-relaxed">Data pengiriman hari ini telah berhasil disinkronisasi ke sistem pusat.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl text-left space-y-3">
             <div className="flex justify-between items-center text-[9px] font-semibold uppercase text-slate-400">
                <span>Diterima Oleh:</span>
                <span className="text-slate-900">{appState.handoverLeader}</span>
             </div>
             <div className="flex justify-between items-center text-[9px] font-semibold uppercase text-slate-400">
                <span>Log Aktivitas:</span>
                <span className="text-emerald-600">Terverifikasi</span>
             </div>
          </div>
          <button 
            onClick={onReset}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold uppercase text-[10px] active:scale-95 shadow-lg transition-all"
          >
            Tutup Aplikasi
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-20">
      {renderContent()}

      {selectedPkg && !showProofModal && !showCancelModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-6 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">Detail Paket</h3>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{selectedPkg.trackingNumber}</p>
              </div>
              <button onClick={() => setSelectedPkg(null)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-100">
                <div className="flex gap-3">
                   <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm h-fit"><MapPin size={18} /></div>
                   <div>
                      <div className="text-[8px] font-semibold text-slate-400 uppercase mb-0.5 tracking-widest">Destinasi</div>
                      <p className="text-xs font-semibold text-slate-800 uppercase leading-snug">{selectedPkg.address}</p>
                   </div>
                </div>
                {selectedPkg.isCod && (
                  <div className="flex gap-3 pt-4 border-t border-slate-200/50">
                    <div className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm h-fit"><Banknote size={18} /></div>
                    <div>
                        <div className="text-[8px] font-semibold text-slate-400 uppercase mb-0.5 tracking-widest">Tagihan Tunai</div>
                        <p className="text-lg font-semibold text-emerald-600 tabular-nums">Rp {selectedPkg.codAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowCancelModal(true)} 
                className="py-4 bg-white text-rose-500 border border-rose-100 rounded-xl font-semibold uppercase text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Gagal Antar
              </button>
              <button 
                onClick={() => setShowProofModal(true)} 
                className="py-4 bg-[#0022FF] text-white rounded-xl font-semibold uppercase text-[10px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Konfirmasi <CheckCircle2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showProofModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 space-y-5 animate-in zoom-in-95 shadow-2xl">
             <div className="text-center">
                <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white">
                   <CheckCircle2 size={24} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Laporan Terkirim</h3>
                <p className="text-[9px] font-medium text-slate-400 uppercase mt-1">Lengkapi data penerimaan</p>
             </div>
             
             <div className="space-y-4">
                <div className="w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer overflow-hidden">
                   <Camera size={28} strokeWidth={1.5} />
                   <span className="text-[9px] font-semibold uppercase mt-2 tracking-widest">Ambil Bukti Foto</span>
                </div>
                
                <div className="space-y-1.5 px-1">
                  <label className="text-[8px] font-semibold uppercase text-slate-400 tracking-widest">Penerima Paket</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      placeholder="Input Nama..."
                      className="w-full py-3.5 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500/50"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                </div>
             </div>

             <div className="flex flex-col gap-2">
                <button 
                  onClick={handleFinishDelivery} 
                  disabled={!recipientName} 
                  className="w-full py-4 font-semibold text-[10px] uppercase text-white bg-emerald-600 rounded-xl shadow-sm active:scale-95 disabled:opacity-30"
                >
                  Kirim Sekarang
                </button>
                <button onClick={() => setShowProofModal(false)} className="w-full py-1.5 font-semibold text-[9px] uppercase text-slate-400 bg-transparent">Kembali</button>
             </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 space-y-5 animate-in zoom-in-95 shadow-2xl">
             <div className="text-center">
                <div className="bg-rose-50 text-rose-500 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white">
                   <AlertCircle size={24} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Tunda Antaran</h3>
                <p className="text-[9px] font-medium text-slate-400 uppercase mt-1">Pilih Kendala Lapangan</p>
             </div>
             
             <div className="space-y-1.5">
               {[
                 "Alamat Tidak Ditemukan",
                 "Penerima Tidak di Tempat",
                 "Rumah Kosong/Tutup",
                 "Ditolak Penerima"
               ].map((reason, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCancelReason(reason)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-semibold transition-all border ${cancelReason === reason ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'}`}
                 >
                    {reason}
                 </button>
               ))}
             </div>

             <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={handleCancelDelivery} 
                  disabled={!cancelReason} 
                  className="w-full py-4 font-semibold text-[10px] uppercase text-white bg-rose-500 rounded-xl shadow-sm active:scale-95 disabled:opacity-30"
                >
                  Konfirmasi Kendala
                </button>
                <button onClick={() => setShowCancelModal(false)} className="w-full py-1.5 font-semibold text-[9px] uppercase text-slate-400 bg-transparent">Batal</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;
