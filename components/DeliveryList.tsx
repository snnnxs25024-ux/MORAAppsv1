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
  Printer,
  ChevronDown,
  Star,
  Zap,
  // Added missing Fingerprint import
  Fingerprint
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
  const [activeTab, setActiveTab] = useState<'BERHASIL' | 'KENDALA'>('BERHASIL');

  useEffect(() => {
    if (location.state?.search) setSearchQuery(location.state.search);
  }, [location.state]);

  const deliveredPackages = packages.filter(p => p.status === DeliveryStatus.DELIVERED);
  const pendingPackages = packages.filter(p => p.status === DeliveryStatus.PENDING);
  const totalProcessed = deliveredPackages.length + pendingPackages.length;
  const successRate = packages.length > 0 ? Math.round((deliveredPackages.length / packages.length) * 100) : 0;
  
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
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-6">
        {/* Progress Ring with Glow Effect */}
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
            <circle 
              cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" 
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - successRate / 100)}
              className={`${successRate === 100 ? 'text-blue-600' : 'text-emerald-500'} transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 leading-none">{successRate}%</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">SLA Harian</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between p-2 rounded-2xl transition-colors hover:bg-emerald-50/50 cursor-pointer" onClick={() => setActiveTab('BERHASIL')}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Berhasil</span>
            </div>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{deliveredPackages.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-2xl transition-colors hover:bg-amber-50/50 cursor-pointer" onClick={() => setActiveTab('KENDALA')}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kendala</span>
            </div>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{pendingPackages.length}</span>
          </div>
          <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between px-2">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Tugas</span>
             <span className="text-sm font-bold text-slate-900 tabular-nums">{packages.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#f0f9ff] p-5 rounded-2xl flex items-center justify-between border border-blue-100/50 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:scale-150 transition-transform duration-1000">
            <Banknote size={80} className="text-blue-900" />
         </div>
         <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white text-[#0022FF] rounded-2xl shadow-sm"><Banknote size={20} /></div>
            <div>
               <div className="text-[9px] font-bold text-blue-600/70 uppercase tracking-widest">Saldo COD Terkumpul</div>
               <div className="text-lg font-bold text-blue-900 tracking-tight">Rp {totalCodCollected.toLocaleString()}</div>
            </div>
         </div>
         <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm">
            <TrendingUp size={16} />
         </div>
      </div>
    </div>
  );

  const renderCategorizedLists = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
         <button 
           onClick={() => setActiveTab('BERHASIL')}
           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${activeTab === 'BERHASIL' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
         >
            <CheckCircle2 size={14} /> Berhasil
         </button>
         <button 
           onClick={() => setActiveTab('KENDALA')}
           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${activeTab === 'KENDALA' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
         >
            <AlertCircle size={14} /> Kendala
         </button>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {activeTab === 'BERHASIL' ? (
          <>
            {deliveredPackages.map(pkg => (
              <div key={pkg.id} onClick={() => setShowHistoryPkg(pkg)} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] hover:border-emerald-200 transition-all animate-in slide-in-from-right-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><CheckCircle size={18} /></div>
                  <div>
                     <div className="text-[11px] font-bold text-slate-900 tracking-tight">{pkg.trackingNumber}</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <User size={10} className="text-emerald-400" /> {pkg.recipientName} <span className="text-slate-200">•</span> {pkg.deliveryTime}
                     </div>
                  </div>
                </div>
                <ChevronDown size={16} className="text-slate-200 -rotate-90" />
              </div>
            ))}
            {deliveredPackages.length === 0 && (
               <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <PackageIcon size={48} className="text-slate-300 mb-2" strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Belum Ada Data</p>
               </div>
            )}
          </>
        ) : (
          <>
            {pendingPackages.map(pkg => (
              <div key={pkg.id} onClick={() => setShowHistoryPkg(pkg)} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] hover:border-amber-200 transition-all animate-in slide-in-from-left-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Info size={18} /></div>
                  <div>
                     <div className="text-[11px] font-bold text-slate-900 tracking-tight">{pkg.trackingNumber}</div>
                     <div className="text-[9px] font-bold text-amber-600/80 uppercase italic line-clamp-1 flex items-center gap-1">
                        <AlertCircle size={10} /> "{pkg.cancelReason}"
                     </div>
                  </div>
                </div>
                <ChevronDown size={16} className="text-slate-200 -rotate-90" />
              </div>
            ))}
            {pendingPackages.length === 0 && (
               <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <AlertCircle size={48} className="text-slate-300 mb-2" strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Semua Lancar</p>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (!appState.isClockedIn) {
      return (
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center space-y-8 animate-in fade-in zoom-in-95 mt-8">
          <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center text-amber-500 mx-auto border-4 border-white shadow-md">
            <Fingerprint size={36} />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-lg uppercase tracking-tight">Akses Terbatas</h3>
            <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed px-4">Lakukan absensi sidik jari digital untuk membuka tugas pengiriman hari ini.</p>
          </div>
          <Link to="/attendance" className="flex items-center justify-center gap-3 bg-slate-900 text-white w-full py-5 rounded-[2rem] font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
            Ke Halaman Absensi <ArrowRight size={18} />
          </Link>
        </div>
      );
    }

    if (appState.currentStep === 'SETUP_TOTAL') {
      return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 mt-4">
          <div className="px-1">
             <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Rencana Muatan</h1>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-[0.2em]">Tahap 1: Estimasi Fisik Barang</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Paket COD</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Banknote size={18} /></div>
                   <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-12 pr-4 text-3xl font-bold text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all"
                    value={codInput}
                    onChange={(e) => setCodInput(e.target.value)}
                   />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">NON-COD</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><PackageIcon size={18} /></div>
                   <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-12 pr-4 text-3xl font-bold text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all"
                    value={nonCodInput}
                    onChange={(e) => setNonCodInput(e.target.value)}
                   />
                </div>
              </div>
            </div>
            <button 
              onClick={() => onSetupTotal(parseInt(codInput || '0'), parseInt(nonCodInput || '0'))}
              disabled={(parseInt(codInput || '0') + parseInt(nonCodInput || '0') <= 0)}
              className="w-full bg-[#0022FF] text-white py-5 rounded-3xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-30 transition-all"
            >
              Konfirmasi & Mulai Scan
            </button>
          </div>
        </div>
      );
    }

    if (appState.currentStep === 'LOADING_SCAN') {
      return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 mt-4">
          <div className="px-1">
             <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Verifikasi Muatan</h1>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Tahap 2: Sinkronisasi Fisik Paket</p>
          </div>
          
          <div className="bg-white p-7 rounded-[2.5rem] border border-blue-50 shadow-xl shadow-blue-900/5 space-y-8">
            <div className="flex justify-between items-center px-1">
              <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-pulse ${isSync ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                {isSync ? 'Data Sinkron' : 'Proses Verifikasi...'}
              </div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{packages.length} Ter-Scan</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-6 rounded-3xl border-2 border-white flex flex-col items-center shadow-sm">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-widest text-center">Layanan COD</div>
                  <div className="text-3xl font-bold text-slate-900 tabular-nums">{scannedCod} <span className="text-slate-200">/</span> {appState.expectedCod}</div>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border-2 border-white flex flex-col items-center shadow-sm">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-widest text-center">NON-COD</div>
                  <div className="text-3xl font-bold text-slate-900 tabular-nums">{scannedNonCod} <span className="text-slate-200">/</span> {appState.expectedNonCod}</div>
               </div>
            </div>

            <div className="flex gap-4">
              <Link to="/scan" className="flex-[1.2] flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] active:scale-95 transition-all shadow-lg shadow-slate-900/20">
                <Scan size={20} /> Mulai Scan
              </Link>
              <button 
                onClick={onFinishLoading}
                disabled={!isSync}
                className="flex-1 bg-[#0022FF] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] disabled:opacity-30 active:scale-95 shadow-xl shadow-blue-500/30 transition-all"
              >
                Mulai Antar
              </button>
            </div>
          </div>

          <div className="space-y-4 px-1 pb-10">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Info size={16} className="text-blue-600" /> Ringkasan Resi Verifikasi
                </h4>
             </div>

             {packages.length === 0 ? (
               <div className="bg-white p-12 rounded-3xl border-2 border-slate-100 border-dashed text-center opacity-40">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Belum Ada Paket</p>
               </div>
             ) : (
               <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${pkg.isCod ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                             <PackageIcon size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                             <div className="text-[12px] font-bold text-slate-900 tracking-tight">{pkg.trackingNumber}</div>
                             <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${pkg.isCod ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                   {pkg.isCod ? 'Tunai' : 'Non-Tunai'}
                                </span>
                                {pkg.isCod && <span className="text-[9px] font-bold text-slate-400">Rp {pkg.codAmount?.toLocaleString()}</span>}
                             </div>
                          </div>
                       </div>
                       <button 
                          onClick={() => onRemove(pkg.id)}
                          className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all active:scale-90"
                       >
                          <Trash2 size={18} />
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
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 mt-4">
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
               <div>
                  <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Daftar Tugas</h1>
                  <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-widest flex items-center gap-2">
                     <Zap size={12} className="text-amber-500 fill-amber-500" /> Monitoring Real-time
                  </p>
               </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari Resi atau Alamat..." 
                  className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-[12px] font-bold focus:ring-8 focus:ring-blue-500/5 outline-none shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/scan" className="bg-[#0022FF] text-white p-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-90 transition-all">
                <Scan size={24} />
              </Link>
            </div>
          </div>

          <div className="space-y-3 pb-10">
            {filteredPackages.length === 0 ? (
              <div className="bg-white p-16 rounded-[3rem] text-center space-y-4 border border-slate-50 shadow-sm opacity-40">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <PackageIcon size={40} strokeWidth={1} />
                 </div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Daftar Kosong</p>
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
                    className={`bg-white p-5 rounded-[2rem] border shadow-sm flex items-center gap-5 transition-all active:scale-[0.98] cursor-pointer group
                      ${(pkg.status === DeliveryStatus.DELIVERED || pkg.status === DeliveryStatus.PENDING) 
                        ? 'border-slate-50 bg-slate-50/50 grayscale' 
                        : 'border-slate-100 hover:border-blue-200 hover:shadow-md'}`}
                  >
                    <div className={`p-4 rounded-3xl shrink-0 transition-transform group-hover:scale-110 ${
                      pkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-100 text-emerald-600' : 
                      pkg.status === DeliveryStatus.PENDING ? 'bg-amber-100 text-amber-500' :
                      'bg-blue-50 text-[#0022FF]'
                    }`}>
                      {pkg.status === DeliveryStatus.DELIVERED ? <CheckCircle2 size={24} /> : <PackageIcon size={24} strokeWidth={2} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm tracking-tight">{pkg.trackingNumber}</span>
                          {pkg.isCod && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 mt-1">
                              <Banknote size={12} /> Rp {pkg.codAmount?.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                          pkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-500 text-white' : 
                          pkg.status === DeliveryStatus.PENDING ? 'bg-amber-500 text-white' : 
                          'bg-[#0022FF] text-white shadow-lg shadow-blue-500/20'
                        }`}>
                          {pkg.status === DeliveryStatus.PICKED_UP ? 'Antar' : pkg.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                        <MapPin size={12} className="shrink-0 text-slate-300" />
                        <span className="truncate uppercase tracking-tight">{pkg.address}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Selesai & Serah Terima Button at bottom of list */}
                <div className="pt-6 pb-12">
                  <button 
                    onClick={onStartHandover}
                    className={`w-full py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl 
                      ${isAllProcessed 
                        ? 'bg-slate-900 text-white shadow-slate-900/30 active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    Selesai & Serah Terima <RotateCcw size={18} />
                  </button>
                  {!isAllProcessed && (
                    <p className="text-[9px] text-center text-slate-400 uppercase mt-4 font-bold tracking-[0.2em] animate-pulse">
                      Selesaikan Semua Antaran Dahulu
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
        <div className="space-y-6 animate-in zoom-in-95 duration-500 mt-4 pb-20">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Ringkasan Performa</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Tinjau Data Sebelum Handover</p>
          </div>

          {renderStatsChart()}
          {renderCategorizedLists()}

          <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 shadow-xl shadow-slate-200/40 space-y-8 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Data Serah Terima</div>

            <div className="space-y-6 pt-4">
              <div 
                onClick={() => setHandoverPhoto('https://picsum.photos/seed/handover/600/400')}
                className={`w-full aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-slate-50 ${handoverPhoto ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}
              >
                {handoverPhoto ? (
                  <img src={handoverPhoto} className="w-full h-full object-cover rounded-[1.8rem]" alt="Proof" />
                ) : (
                  <>
                    <Camera size={40} className="text-slate-300" strokeWidth={1} />
                    <span className="text-[10px] font-bold uppercase text-slate-400 mt-3 tracking-widest">Foto Serah Terima Paket</span>
                  </>
                )}
              </div>

              <div className="space-y-3 px-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verifikasi Leader Gudang</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    placeholder="Nama Penanggung Jawab..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                    value={handoverLeader}
                    onChange={(e) => setHandoverLeader(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => onCompleteHandover(handoverPhoto || '', handoverLeader)}
              disabled={!handoverPhoto || !handoverLeader}
              className="w-full bg-[#0022FF] text-white py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] active:scale-95 disabled:opacity-30 transition-all shadow-2xl shadow-blue-500/40"
            >
              Kirim & Tutup Shift
            </button>
          </div>
        </div>
      );
    }

    if (appState.currentStep === 'COMPLETED') {
      return (
        <div className="space-y-6 animate-in fade-in duration-1000 mt-4 pb-20">
          {/* Digital Receipt Header */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 overflow-hidden border border-slate-100 relative">
             <div className="bg-emerald-600 p-10 text-white text-center space-y-6">
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 border-white/30 shadow-inner">
                   <CheckCircle2 size={48} className="drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold uppercase tracking-tight">Shift Berakhir</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                     <Star size={14} className="fill-amber-400 text-amber-400" />
                     <Star size={14} className="fill-amber-400 text-amber-400" />
                     <Star size={14} className="fill-amber-400 text-amber-400" />
                     <Star size={14} className="fill-amber-400 text-amber-400" />
                     <Star size={14} className="fill-amber-400 text-amber-400" />
                  </div>
                </div>
             </div>

             <div className="p-8 space-y-6">
                {/* Dashed line Receipt Look */}
                <div className="border-t-2 border-dashed border-slate-200 pt-6 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
                   <span>ID Penyerahan</span>
                   <span className="text-slate-900">MORA-REC-{Math.floor(Math.random()*90000)}</span>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diterima Oleh</span>
                      <span className="text-[12px] font-bold text-slate-900 uppercase">{appState.handoverLeader}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Verifikasi</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase">Valid</span>
                   </div>
                </div>

                {renderStatsChart()}
                {renderCategorizedLists()}

                <div className="pt-6 border-t-2 border-dashed border-slate-200">
                   <button 
                     onClick={() => window.print()}
                     className="w-full flex items-center justify-center gap-3 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                   >
                     <Printer size={18} /> Simpan Laporan Digital
                   </button>
                </div>
             </div>
             
             {/* Receipt Cut Edge Bottom Effect */}
             <div className="h-4 w-full bg-slate-100 flex gap-1 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-white rotate-45 -mt-4 shrink-0"></div>
                ))}
             </div>
          </div>
          
          <button 
            onClick={onReset}
            className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-bold uppercase text-[12px] tracking-[0.3em] active:scale-95 shadow-2xl shadow-slate-900/40 transition-all"
          >
            Keluar Aplikasi
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-20">
      {renderContent()}

      {/* Detail Modal enhanced with Glassmorphism */}
      {showHistoryPkg && (
        <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500">
             <div className={`p-8 text-white flex justify-between items-center ${showHistoryPkg.status === DeliveryStatus.DELIVERED ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><History size={24} /></div>
                   <div>
                      <h3 className="text-base font-bold uppercase tracking-tight">Detail Tugas</h3>
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{showHistoryPkg.trackingNumber}</p>
                   </div>
                </div>
                <button onClick={() => setShowHistoryPkg(null)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90"><X size={24} /></button>
             </div>

             <div className="p-8 space-y-6">
                {showHistoryPkg.status === DeliveryStatus.DELIVERED ? (
                  <>
                    <div className="rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner aspect-video bg-slate-100 group relative">
                       <img src={showHistoryPkg.proofImage} alt="Bukti" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-[9px] font-bold uppercase tracking-widest">Bukti Pengiriman Sah</span>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Penerima</span>
                          <p className="text-xs font-bold text-slate-800 uppercase">{showHistoryPkg.recipientName}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Waktu Serah</span>
                          <p className="text-xs font-bold text-slate-800">{showHistoryPkg.deliveryTime || 'Terkirim'}</p>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-amber-50 p-7 rounded-[2rem] border-2 border-amber-100 flex flex-col items-center text-center space-y-4">
                     <AlertCircle size={48} className="text-amber-500 animate-bounce" />
                     <div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Laporan Kendala</span>
                        <p className="text-sm font-bold text-amber-900 mt-2 uppercase italic leading-relaxed">"{showHistoryPkg.cancelReason}"</p>
                     </div>
                  </div>
                )}

                <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                   <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-slate-600 uppercase leading-snug">{showHistoryPkg.address}</p>
                   </div>
                </div>

                <button 
                  onClick={() => setShowHistoryPkg(null)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-bold uppercase text-[11px] tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                >
                  Tutup Detail
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Standard Modals remain with consistent styling */}
      {selectedPkg && !showProofModal && !showCancelModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in slide-in-from-bottom-10">
          <div className="bg-white w-full max-sm rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Konfirmasi Antar</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedPkg.trackingNumber}</p>
              </div>
              <button onClick={() => setSelectedPkg(null)} className="p-3 bg-slate-50 rounded-2xl text-slate-400"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-3xl space-y-6 border border-slate-100">
                <div className="flex gap-4">
                   <div className="p-4 bg-white text-blue-600 rounded-2xl shadow-sm h-fit"><MapPin size={24} /></div>
                   <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Alamat Penerima</div>
                      <p className="text-sm font-bold text-slate-800 uppercase leading-snug">{selectedPkg.address}</p>
                   </div>
                </div>
                {selectedPkg.isCod && (
                  <div className="flex gap-4 pt-6 border-t border-slate-200/50">
                    <div className="p-4 bg-white text-emerald-600 rounded-2xl shadow-sm h-fit"><Banknote size={24} /></div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Tagihan Tunai</div>
                        <p className="text-2xl font-bold text-emerald-600 tabular-nums tracking-tight">Rp {selectedPkg.codAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowCancelModal(true)} 
                className="py-5 bg-white text-rose-500 border-2 border-rose-50 rounded-2xl font-bold uppercase text-[11px] tracking-widest active:scale-95 transition-all"
              >
                Gagal
              </button>
              <button 
                onClick={() => setShowProofModal(true)} 
                className="py-5 bg-[#0022FF] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
              >
                Terkirim
              </button>
            </div>
          </div>
        </div>
      )}

      {showProofModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xs rounded-[3rem] p-8 space-y-8 animate-in zoom-in-95 shadow-2xl">
             <div className="text-center">
                <div className="bg-emerald-50 text-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                   <CheckCircle2 size={36} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Laporan Sukses</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Verifikasi Penerima</p>
             </div>
             
             <div className="space-y-6">
                <div className="w-full aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer overflow-hidden transition-all hover:bg-emerald-50/30">
                   <Camera size={40} strokeWidth={1} />
                   <span className="text-[10px] font-bold uppercase mt-3 tracking-widest">Ambil Bukti Foto</span>
                </div>
                
                <div className="space-y-2 px-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Diterima Oleh</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="text" 
                      placeholder="Input Nama Penerima..."
                      className="w-full py-4 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
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
                  className="w-full py-5 font-bold text-[11px] uppercase tracking-widest text-white bg-emerald-600 rounded-[1.8rem] shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-30"
                >
                  Kirim Sekarang
                </button>
                <button onClick={() => setShowProofModal(false)} className="w-full py-2 font-bold text-[10px] uppercase text-slate-400 bg-transparent">Kembali</button>
             </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-8 animate-in zoom-in-95 shadow-2xl">
             <div className="text-center">
                <div className="bg-rose-50 text-rose-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                   <AlertCircle size={36} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Status Tunda</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pilih Kendala Paket</p>
             </div>
             
             {!isCustomReason ? (
               <div className="grid grid-cols-1 gap-2">
                 {[
                   "Alamat Tidak Ditemukan",
                   "Penerima Tidak di Tempat",
                   "Rumah Kosong/Tutup",
                   "Ditolak Penerima"
                 ].map((reason, idx) => (
                   <button 
                      key={idx}
                      onClick={() => setCancelReason(reason)}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-bold transition-all border-2 ${cancelReason === reason ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'}`}
                   >
                      {reason}
                   </button>
                 ))}
                 <button 
                    onClick={() => { setIsCustomReason(true); setCancelReason(''); }}
                    className="w-full text-left px-5 py-4 rounded-2xl text-xs font-bold transition-all border-2 bg-blue-50/30 border-blue-100/50 text-blue-600 hover:bg-blue-50 flex items-center justify-between group"
                 >
                    Lainnya (Manual)
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             ) : (
               <div className="space-y-4 animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-3 mb-2">
                     <button onClick={() => setIsCustomReason(false)} className="p-2 bg-slate-100 rounded-xl text-slate-500"><RotateCcw size={16} /></button>
                     <span className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Input Deskripsi Kendala</span>
                  </div>
                  <div className="relative">
                    <MessageSquareQuote className="absolute left-4 top-4 text-slate-300" size={20} />
                    <textarea 
                      placeholder="Tuliskan keterangan lengkap..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 pl-12 text-sm font-bold min-h-[140px] outline-none focus:border-rose-300 focus:bg-white transition-all shadow-inner"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                    ></textarea>
                  </div>
               </div>
             )}

             <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleCancelDelivery} 
                  disabled={(!cancelReason && !isCustomReason) || (isCustomReason && !customReason)} 
                  className="w-full py-5 font-bold text-[11px] uppercase tracking-widest text-white bg-rose-500 rounded-[1.8rem] shadow-xl shadow-rose-900/20 active:scale-95 disabled:opacity-30"
                >
                  Tunda Pengiriman
                </button>
                <button onClick={() => { setShowCancelModal(false); setIsCustomReason(false); }} className="w-full py-2 font-bold text-[10px] uppercase text-slate-400 bg-transparent">Batal</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;