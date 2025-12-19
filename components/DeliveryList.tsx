
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

  // Flow States
  const [codInput, setCodInput] = useState('');
  const [nonCodInput, setNonCodInput] = useState('');
  const [handoverLeader, setHandoverLeader] = useState('');
  const [handoverPhoto, setHandoverPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.search) {
      setSearchQuery(location.state.search);
    }
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
    // 1. CEK ABSENSI
    if (!appState.isClockedIn) {
      return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95 mt-10">
          <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center text-amber-500 mx-auto border-4 border-white shadow-md">
            <AlertCircle size={40} />
          </div>
          <div className="px-4">
            <h3 className="text-slate-900 font-black text-lg uppercase tracking-tight">Wajib Presensi</h3>
            <p className="text-slate-500 text-[11px] font-medium mt-1 leading-relaxed">Silakan lakukan absensi terlebih dahulu di menu Presensi untuk mengakses tugas hari ini.</p>
          </div>
          <Link to="/attendance" className="flex items-center justify-center gap-2 bg-[#0022FF] text-white w-full py-5 rounded-3xl font-bold uppercase tracking-wider text-[11px] shadow-lg active:scale-95 transition-all">
            Ke Menu Absensi <ArrowRight size={14} />
          </Link>
        </div>
      );
    }

    // 2. SETUP TOTAL PAKET
    if (appState.currentStep === 'SETUP_TOTAL') {
      return (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 mt-4">
          <div className="px-1">
             <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">Siapkan Muatan</h1>
             <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Langkah 1: Input Rencana Barang</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Paket COD</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-2xl font-black text-slate-900 focus:border-[#0022FF] outline-none"
                  value={codInput}
                  onChange={(e) => setCodInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Paket NON-COD</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-2xl font-black text-slate-900 focus:border-[#0022FF] outline-none"
                  value={nonCodInput}
                  onChange={(e) => setNonCodInput(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={() => onSetupTotal(parseInt(codInput || '0'), parseInt(nonCodInput || '0'))}
              disabled={(parseInt(codInput || '0') + parseInt(nonCodInput || '0') <= 0)}
              className="w-full bg-[#0022FF] text-white py-5 rounded-3xl font-black uppercase tracking-wider text-[11px] shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-30 transition-all"
            >
              Lanjutkan Ke Scanning
            </button>
          </div>
        </div>
      );
    }

    // 3. LOADING SCAN
    if (appState.currentStep === 'LOADING_SCAN') {
      return (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 mt-4">
          <div className="px-1">
             <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">Verifikasi Barang</h1>
             <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Langkah 2: Scan Barcode Paket</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-2">
              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isSync ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                {isSync ? 'Data Sinkron' : 'Belum Sinkron'}
              </div>
              <div className="text-[10px] font-black text-slate-300 uppercase">Total: {packages.length}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-2">COD</div>
                  <div className="text-2xl font-black text-slate-900">{scannedCod} <span className="text-slate-300">/</span> {appState.expectedCod}</div>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-2">Non-COD</div>
                  <div className="text-2xl font-black text-slate-900">{scannedNonCod} <span className="text-slate-300">/</span> {appState.expectedNonCod}</div>
               </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link to="/scan" className="flex-[2] flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-wider text-[11px] active:scale-95 transition-all shadow-xl">
                <Scan size={20} /> Mulai Scan
              </Link>
              <button 
                onClick={onFinishLoading}
                disabled={!isSync}
                className="flex-1 bg-[#0022FF] text-white py-5 rounded-3xl font-black uppercase tracking-wider text-[11px] disabled:opacity-20 active:scale-95 shadow-xl shadow-blue-500/20"
              >
                Mulai
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 4. DELIVERING (MAIN LIST)
    if (appState.currentStep === 'DELIVERING') {
      return (
        <div className="space-y-5 animate-in slide-in-from-right-2 duration-500">
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
               <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">Tugas Antaran</h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Shift Sedang Berjalan</p>
               </div>
               <button onClick={onStartHandover} className="p-3 bg-amber-50 text-amber-600 rounded-2xl active:scale-90">
                 <RotateCcw size={20} />
               </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari Resi atau Alamat..." 
                  className="w-full pl-12 pr-4 py-5 bg-white border border-slate-100 rounded-[2rem] text-xs font-bold focus:ring-4 focus:ring-[#0022FF]/5 outline-none shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/scan" className="bg-[#0022FF] text-white p-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-90 transition-transform">
                <Scan size={22} />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPackages.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] text-center space-y-4 border border-slate-100 shadow-sm">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <PackageIcon size={40} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Belum Ada Paket</p>
              </div>
            ) : (
              filteredPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  onClick={() => (pkg.status !== DeliveryStatus.DELIVERED && pkg.status !== DeliveryStatus.PENDING) && setSelectedPkg(pkg)}
                  className={`bg-white p-5 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-5 transition-all active:scale-[0.98] 
                    ${(pkg.status === DeliveryStatus.DELIVERED || pkg.status === DeliveryStatus.PENDING) ? 'opacity-60 grayscale' : 'cursor-pointer hover:border-blue-200 shadow-md shadow-blue-500/5'}`}
                >
                  <div className={`p-5 rounded-3xl shrink-0 ${
                    pkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-50 text-emerald-500' : 
                    pkg.status === DeliveryStatus.PENDING ? 'bg-amber-50 text-amber-500' :
                    'bg-blue-50 text-[#0022FF]'
                  }`}>
                    <PackageIcon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm tracking-tight">{pkg.trackingNumber}</span>
                        {pkg.isCod && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit mt-1">
                            <Banknote size={10} /> Rp {pkg.codAmount?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        pkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-500 text-white' : 
                        pkg.status === DeliveryStatus.PENDING ? 'bg-amber-500 text-white' : 
                        'bg-[#0022FF] text-white'
                      }`}>
                        {pkg.status === DeliveryStatus.PICKED_UP ? 'Proses' : pkg.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                      <MapPin size={12} className="shrink-0 text-[#0022FF]" />
                      <span className="truncate uppercase">{pkg.address}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    // 5. HANDOVER
    if (appState.currentStep === 'HANDOVER') {
      const pendingPackages = packages.filter(p => p.status === DeliveryStatus.PENDING);
      return (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 animate-in zoom-in-95 mt-4">
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-900 uppercase">Serah Terima Akhir</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Kembalikan {pendingPackages.length} Paket Pending Ke Gudang</p>
          </div>

          <div className="space-y-6">
            <div 
              onClick={() => setHandoverPhoto('https://picsum.photos/seed/handover/600/400')}
              className={`w-full aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${handoverPhoto ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}
            >
              {handoverPhoto ? (
                <img src={handoverPhoto} className="w-full h-full object-cover rounded-[1.8rem]" alt="Bukti Serah Terima" />
              ) : (
                <>
                  <Camera size={40} className="text-slate-300" />
                  <span className="text-[10px] font-black uppercase text-slate-400 mt-3">Foto Bukti Barang</span>
                </>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Penerima Gudang</label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Ketik Nama Leader"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-4 text-sm font-black text-slate-900 outline-none focus:border-[#0022FF]"
                  value={handoverLeader}
                  onChange={(e) => setHandoverLeader(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => onCompleteHandover(handoverPhoto || '', handoverLeader)}
            disabled={!handoverPhoto || !handoverLeader}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-wider text-[11px] shadow-xl active:scale-95 disabled:opacity-30"
          >
            Konfirmasi Serah Terima
          </button>
        </div>
      );
    }

    // 6. COMPLETED
    if (appState.currentStep === 'COMPLETED') {
      return (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center space-y-8 animate-in fade-in mt-4">
          <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
            <UserCheck size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Shift Selesai</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">Terima kasih atas kerja keras Anda hari ini!</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl text-left space-y-4">
             <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>Leader Gudang:</span>
                <span className="text-slate-900">{appState.handoverLeader}</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>Status Paket:</span>
                <span className="text-emerald-600">Terproses Semua</span>
             </div>
          </div>
          <button 
            onClick={onReset}
            className="w-full bg-[#0022FF] text-white py-5 rounded-3xl font-black uppercase text-[11px] active:scale-95 shadow-xl shadow-blue-500/20"
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

      {/* DETAIL MODAL (SAME AS BEFORE BUT STYLED) */}
      {selectedPkg && !showProofModal && !showCancelModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 space-y-8 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Detail Paket</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedPkg.trackingNumber}</p>
              </div>
              <button onClick={() => setSelectedPkg(null)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 active:scale-90"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl space-y-5">
                <div className="flex gap-4">
                   <div className="p-4 bg-white text-[#0022FF] rounded-2xl shadow-sm h-fit"><MapPin size={24} /></div>
                   <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Alamat Lengkap</div>
                      <p className="text-sm font-bold text-slate-800 uppercase leading-snug">{selectedPkg.address}</p>
                   </div>
                </div>
                {selectedPkg.isCod && (
                  <div className="flex gap-4 pt-4 border-t border-slate-200">
                    <div className="p-4 bg-white text-emerald-600 rounded-2xl shadow-sm h-fit"><Banknote size={24} /></div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Tagihan COD</div>
                        <p className="text-xl font-black text-emerald-600">Rp {selectedPkg.codAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowCancelModal(true)} 
                className="py-5 bg-white text-rose-500 border-2 border-rose-500/10 rounded-2xl font-black uppercase text-[11px] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <X size={16} /> Gagal
              </button>
              <button 
                onClick={() => setShowProofModal(true)} 
                className="py-5 bg-[#0022FF] text-white rounded-2xl font-black uppercase text-[11px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Terkirim <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUCCESS (SAME AS BEFORE BUT STYLED) */}
      {showProofModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 animate-in zoom-in-95 shadow-2xl">
             <div className="text-center">
                <div className="bg-emerald-50 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                   <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Konfirmasi Selesai</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Input Nama Penerima</p>
             </div>
             
             <div className="space-y-5">
                <div 
                  onClick={() => {}}
                  className="w-full aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-[#0022FF] transition-all overflow-hidden"
                >
                   <Camera size={40} />
                   <span className="text-[10px] font-black uppercase mt-3">Ambil Foto Bukti</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nama Penerima Paket</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Input Nama..."
                      className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-[#0022FF]"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <button 
                  onClick={handleFinishDelivery} 
                  disabled={!recipientName} 
                  className="w-full py-5 font-black text-[11px] uppercase text-white bg-emerald-600 rounded-2xl shadow-lg active:scale-95 disabled:opacity-20"
                >
                  Kirim Laporan
                </button>
                <button onClick={() => setShowProofModal(false)} className="w-full py-2 font-black text-[10px] uppercase text-slate-400 bg-transparent active:scale-95">Batalkan</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL CANCEL (SAME AS BEFORE BUT STYLED) */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 animate-in zoom-in-95 shadow-2xl">
             <div className="text-center">
                <div className="bg-rose-50 text-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                   <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Gagal Antar</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Pilih Alasan Pending</p>
             </div>
             
             <div className="space-y-2">
               {[
                 "Alamat Tidak Ditemukan",
                 "Penerima Tidak di Tempat",
                 "Rumah Kosong/Tutup",
                 "Ditolak Penerima"
               ].map((reason, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCancelReason(reason)}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-bold transition-all border ${cancelReason === reason ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'}`}
                 >
                    {reason}
                 </button>
               ))}
             </div>

             <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleCancelDelivery} 
                  disabled={!cancelReason} 
                  className="w-full py-5 font-black text-[11px] uppercase text-white bg-rose-500 rounded-2xl shadow-lg active:scale-95 disabled:opacity-20"
                >
                  Konfirmasi Pending
                </button>
                <button onClick={() => setShowCancelModal(false)} className="w-full py-2 font-black text-[10px] uppercase text-slate-400 bg-transparent active:scale-95">Kembali</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;
