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
  Trash2,
  Info,
  History,
  MessageSquareQuote,
  CheckCircle,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  packages: Package[];
  onUpdate: (id: string, status: DeliveryStatus, data?: { recipientName?: string, proofImage?: string, cancelReason?: string, deliveryTime?: string }) => void;
  onRemove: (id: string) => void;
  appState: AppState;
  onSetupTotal: (cod: number, nonCod: number) => void;
  onFinishLoading: () => void;
  onStartHandover: () => void;
  onCompleteHandover: (photo: string, leader: string) => void;
  onReset: () => void;
}

const DeliveryList: React.FC<Props> = ({ 
  packages, onUpdate, onRemove, appState, onSetupTotal, onFinishLoading, onStartHandover, onCompleteHandover, onReset 
}) => {
  const location = useLocation();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [showHistoryPkg, setShowHistoryPkg] = useState<Package | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCustomReason, setIsCustomReason] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [codInput, setCodInput] = useState('');
  const [nonCodInput, setNonCodInput] = useState('');
  const [handoverLeader, setHandoverLeader] = useState('');
  const [handoverPhoto, setHandoverPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.search) setSearchQuery(location.state.search);
  }, [location.state]);

  const deliveredPackages = packages.filter(p => p.status === DeliveryStatus.DELIVERED);
  const pendingPackages = packages.filter(p => p.status === DeliveryStatus.PENDING);
  const totalProcessed = deliveredPackages.length + pendingPackages.length;
  const successRate = totalProcessed > 0 ? Math.round((deliveredPackages.length / packages.length) * 100) : 0;
  
  const totalCodCollected = deliveredPackages
    .filter(p => p.isCod)
    .reduce((sum, p) => sum + (p.codAmount || 0), 0);

  const scannedCod = packages.filter(p => p.isCod).length;
  const scannedNonCod = packages.filter(p => !p.isCod).length;
  const isSync = scannedCod === appState.expectedCod && scannedNonCod === appState.expectedNonCod;

  const isAllProcessed = packages.length > 0 && !packages.some(p => p.status === DeliveryStatus.PICKED_UP);

  const filteredPackages = packages.filter(p => 
    p.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    const aFinished = a.status === DeliveryStatus.DELIVERED || a.status === DeliveryStatus.PENDING;
    const bFinished = b.status === DeliveryStatus.DELIVERED || b.status === DeliveryStatus.PENDING;
    if (aFinished && !bFinished) return 1;
    if (!aFinished && bFinished) return -1;
    return 0;
  });

  const handleFinishDelivery = () => {
    if (selectedPkg && recipientName) {
      onUpdate(selectedPkg.id, DeliveryStatus.DELIVERED, {
        recipientName,
        proofImage: 'https://picsum.photos/seed/' + selectedPkg.id + '/600/400',
        deliveryTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      });
      setShowProofModal(false);
      setSelectedPkg(null);
      setRecipientName('');
    }
  };

  const handleCancelDelivery = () => {
    const finalReason = isCustomReason ? customReason : cancelReason;
    if (selectedPkg && finalReason) {
      onUpdate(selectedPkg.id, DeliveryStatus.PENDING, {
        cancelReason: finalReason
      });
      setShowCancelModal(false);
      setIsCustomReason(false);
      setSelectedPkg(null);
      setCancelReason('');
      setCustomReason('');
    }
  };

  const renderStatsChart = () => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        {/* Progress Ring Custom */}
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
            <circle 
              cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - successRate / 100)}
              className="text-emerald-500 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-900 leading-none">{successRate}%</span>
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Success</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Berhasil</span>
            </div>
            <span className="text-xs font-bold text-slate-900 tabular-nums">{deliveredPackages.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Kendala</span>
            </div>
            <span className="text-xs font-bold text-slate-900 tabular-nums">{pendingPackages.length}</span>
          </div>
          <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Paket</span>
             <span className="text-xs font-bold text-slate-900 tabular-nums">{packages.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 p-4 rounded-2xl flex items-center justify-between border border-emerald-100/50">
         <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-emerald-600 rounded-xl shadow-sm"><Banknote size={18} /></div>
            <div>
               <div className="text-[8px] font-bold text-emerald-600/70 uppercase tracking-widest">COD Terkumpul</div>
               <div className="text-sm font-bold text-emerald-700 tracking-tight">Rp {totalCodCollected.toLocaleString()}</div>
            </div>
         </div>
         <TrendingUp size={20} className="text-emerald-400" />
      </div>
    </div>
  );

  const renderCategorizedLists = () => (
    <div className="space-y-6">
      {/* Berhasil Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={14} /> Berhasil Terkirim ({deliveredPackages.length})
          </h4>
        </div>
        <div className="space-y-2">
          {deliveredPackages.map(pkg => (
            <div key={pkg.id} onClick={() => setShowHistoryPkg(pkg)} className="bg-white p-3.5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><CheckCircle size={14} /></div>
                <div>
                   <div className="text-[10px] font-bold text-slate-900 tracking-tight">{pkg.trackingNumber}</div>
                   <div className="text-[8px] font-medium text-slate-400 uppercase">Penerima: {pkg.recipientName} • {pkg.deliveryTime}</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-200" />
            </div>
          ))}
          {deliveredPackages.length === 0 && <p className="text-[9px] text-center text-slate-300 uppercase py-4 border border-dashed rounded-2xl">Tidak ada data</p>}
        </div>
      </div>

      {/* Kendala Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={14} /> Kendala Lapangan ({pendingPackages.length})
          </h4>
        </div>
        <div className="space-y-2">
          {pendingPackages.map(pkg => (
            <div key={pkg.id} onClick={() => setShowHistoryPkg(pkg)} className="bg-white p-3.5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Info size={14} /></div>
                <div>
                   <div className="text-[10px] font-bold text-slate-900 tracking-tight">{pkg.trackingNumber}</div>
                   <div className="text-[8px] font-medium text-amber-600/80 uppercase italic line-clamp-1">"{pkg.cancelReason}"</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-200" />
            </div>
          ))}
          {pendingPackages.length === 0 && <p className="text-[9px] text-center text-slate-300 uppercase py-4 border border-dashed rounded-2xl">Tidak ada data</p>}
        </div>
      </div>
    </div>
  );

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
                  <div className="text-[8px] font-semibold text-slate-400 uppercase mb-2 tracking-widest text-center">Layanan COD</div>
                  <div className="text-xl font-semibold text-slate-900 tabular-nums">{scannedCod} <span className="text-slate-200">/</span> {appState.expectedCod}</div>
               </div>
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <div className="text-[8px] font-semibold text-slate-400 uppercase mb-2 tracking-widest text-center">NON-COD</div>
                  <div className="text-xl font-semibold text-slate-900 tabular-nums">{scannedNonCod} <span className="text-slate-200">/</span> {appState.expectedNonCod}</div>
               </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link to="/scan" className="flex-[1.2] flex items-center justify-center gap-2.5 bg-slate-900 text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-[10px] active:scale-95 transition-all">
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

          <div className="space-y-3 px-1">
             <div className="flex items-center justify-between">
                <h4 className="text-[9px] font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                   <Info size={14} className="text-blue-600" /> Ringkasan Resi Ter-Scan
                </h4>
             </div>

             {packages.length === 0 ? (
               <div className="bg-white p-10 rounded-2xl border border-slate-100 border-dashed text-center">
                 <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Belum ada paket yang di-scan</p>
               </div>
             ) : (
               <div className="space-y-2">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2">
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
              <>
                {filteredPackages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    onClick={() => {
                      if (pkg.status === DeliveryStatus.DELIVERED || pkg.status === DeliveryStatus.PENDING) {
                        setShowHistoryPkg(pkg);
                      } else {
                        setSelectedPkg(pkg);
                      }
                    }}
                    className={`bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4 transition-all active:scale-[0.99] cursor-pointer
                      ${(pkg.status === DeliveryStatus.DELIVERED || pkg.status === DeliveryStatus.PENDING) 
                        ? 'border-emerald-50 bg-emerald-50/20' 
                        : 'border-slate-100 hover:border-blue-100'}`}
                  >
                    <div className={`p-4 rounded-xl shrink-0 ${
                      pkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-100 text-emerald-600' : 
                      pkg.status === DeliveryStatus.PENDING ? 'bg-amber-50 text-amber-500' :
                      'bg-blue-50 text-[#0022FF]'
                    }`}>
                      {pkg.status === DeliveryStatus.DELIVERED ? <CheckCircle size={20} /> : <PackageIcon size={20} strokeWidth={1.5} />}
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
                ))}

                {/* Tombol Selesai Antar di akhir list */}
                <div className="pt-4 pb-8">
                  <button 
                    onClick={onStartHandover}
                    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-lg 
                      ${isAllProcessed 
                        ? 'bg-slate-900 text-white shadow-slate-900/20 active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    Selesai & Serah Terima <RotateCcw size={16} />
                  </button>
                  {!isAllProcessed && (
                    <p className="text-[8px] text-center text-slate-400 uppercase mt-3 font-semibold tracking-widest animate-pulse">
                      Harap selesaikan semua antaran sebelum serah terima
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    if (appState.currentStep === 'HANDOVER') {
      return (
        <div className="space-y-6 animate-in zoom-in-95 mt-4 pb-12">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Ringkasan Performa</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Tinjau Laporan Sebelum Serah Terima</p>
          </div>

          {renderStatsChart()}
          {renderCategorizedLists()}

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Data Serah Terima</h3>
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
                    <span className="text-[10px] font-semibold uppercase text-slate-400 mt-2">Foto Serah Terima Barang</span>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-widest">Nama Petugas Gudang (Leader)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Input Nama Leader..."
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
              className="w-full bg-[#0022FF] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] active:scale-95 disabled:opacity-30 transition-all shadow-lg shadow-blue-500/20"
            >
              Konfirmasi & Selesai Shift
            </button>
          </div>
        </div>
      );
    }

    if (appState.currentStep === 'COMPLETED') {
      return (
        <div className="space-y-6 animate-in fade-in mt-4 pb-12">
          <div className="bg-emerald-600 p-8 rounded-[40px] text-white text-center space-y-6 shadow-xl shadow-emerald-900/10">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto border-4 border-white/30">
               <CheckCircle2 size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight">Shift Berakhir</h3>
              <p className="text-[11px] font-bold text-emerald-100 mt-1 uppercase tracking-widest opacity-80">Terima kasih atas dedikasinya hari ini!</p>
            </div>
            <div className="bg-black/10 p-4 rounded-2xl flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
               <span>Diterima Oleh</span>
               <span className="bg-white text-emerald-600 px-3 py-1 rounded-lg">{appState.handoverLeader}</span>
            </div>
          </div>

          {renderStatsChart()}
          {renderCategorizedLists()}
          
          <button 
            onClick={onReset}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold uppercase text-[11px] tracking-widest active:scale-95 shadow-xl transition-all"
          >
            Tutup Aplikasi & Reset Shift
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-20">
      {renderContent()}

      {/* Modal Riwayat / Detail Paket yang Sudah Diproses */}
      {showHistoryPkg && (
        <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95">
             <div className={`p-6 text-white flex justify-between items-center ${showHistoryPkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-white/20 rounded-xl"><History size={20} /></div>
                   <div>
                      <h3 className="text-sm font-bold uppercase tracking-tight">Laporan Pengiriman</h3>
                      <p className="text-[9px] font-medium opacity-80 uppercase tracking-widest">{showHistoryPkg.trackingNumber}</p>
                   </div>
                </div>
                <button onClick={() => setShowHistoryPkg(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
             </div>

             <div className="p-6 space-y-5">
                {showHistoryPkg.status === DeliveryStatus.DELIVERED ? (
                  <>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-50">
                       <img src={showHistoryPkg.proofImage} alt="Bukti" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Penerima</span>
                          <p className="text-[11px] font-semibold text-slate-800 uppercase">{showHistoryPkg.recipientName}</p>
                       </div>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Waktu Serah</span>
                          <p className="text-[11px] font-semibold text-slate-800">{showHistoryPkg.deliveryTime || '14:20'}</p>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex flex-col items-center text-center space-y-3">
                     <AlertCircle size={32} className="text-amber-500" />
                     <div>
                        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Alasan Kendala</span>
                        <p className="text-xs font-semibold text-amber-900 mt-1 uppercase italic">"{showHistoryPkg.cancelReason}"</p>
                     </div>
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                   <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-medium text-slate-600 uppercase leading-tight">{showHistoryPkg.address}</p>
                   </div>
                </div>

                <button 
                  onClick={() => setShowHistoryPkg(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                >
                  Tutup Detail
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Modal Interaksi Paket (Ready to Deliver) */}
      {selectedPkg && !showProofModal && !showCancelModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-sm rounded-3xl p-6 space-y-6 animate-in slide-in-from-bottom-5">
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
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 space-y-5 animate-in zoom-in-95 shadow-2xl">
             <div className="text-center">
                <div className="bg-rose-50 text-rose-500 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white">
                   <AlertCircle size={24} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Tunda Antaran</h3>
                <p className="text-[9px] font-medium text-slate-400 uppercase mt-1">Pilih Kendala Lapangan</p>
             </div>
             
             {!isCustomReason ? (
               <div className="grid grid-cols-1 gap-1.5">
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
                 <button 
                    onClick={() => { setIsCustomReason(true); setCancelReason(''); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-semibold transition-all border bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-100 flex items-center justify-between"
                 >
                    Lainnya (Tulis Manual)
                    <ArrowRight size={14} />
                 </button>
               </div>
             ) : (
               <div className="space-y-3 animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 mb-2">
                     <button onClick={() => setIsCustomReason(false)} className="p-1.5 bg-slate-100 rounded-lg"><RotateCcw size={14} className="text-slate-500" /></button>
                     <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Input Kendala Spesifik</span>
                  </div>
                  <div className="relative">
                    <MessageSquareQuote className="absolute left-3 top-3 text-slate-300" size={18} />
                    <textarea 
                      placeholder="Tuliskan kendala yang Anda temui di lapangan..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-10 text-xs font-medium min-h-[100px] outline-none focus:border-rose-300 transition-all"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                    ></textarea>
                  </div>
               </div>
             )}

             <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={handleCancelDelivery} 
                  disabled={(!cancelReason && !isCustomReason) || (isCustomReason && !customReason)} 
                  className="w-full py-4 font-semibold text-[10px] uppercase text-white bg-rose-500 rounded-xl shadow-lg shadow-rose-900/10 active:scale-95 disabled:opacity-30"
                >
                  Konfirmasi Kendala
                </button>
                <button onClick={() => { setShowCancelModal(false); setIsCustomReason(false); }} className="w-full py-1.5 font-semibold text-[9px] uppercase text-slate-400 bg-transparent">Batal</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;