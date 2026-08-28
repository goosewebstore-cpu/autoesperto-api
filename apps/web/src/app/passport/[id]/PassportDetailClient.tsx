'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  ShieldCheck,
  Calendar,
  Wrench,
  Clock,
  FileText,
  MessageCircle,
  Share2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  UploadCloud,
  Eye,
  Camera,
  Activity,
  Sparkles,
  ArrowLeft,
  Zap,
  Gauge,
  HelpCircle,
  Check,
  Copy,
  ExternalLink,
  DollarSign,
  Layers,
  Search,
  RotateCcw,
  Printer,
  QrCode,
  Tag,
  Fuel,
  Lock,
  Download,
  Pencil,
  Save,
  Palette,
  Info,
  ArrowLeftRight,
  X,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import {
  getPassportById,
  savePassport,
  updatePassportKm,
  addDocumentToPassport,
  removeDocumentFromPassport,
  addPhotoToPassport,
  deletePhotoFromPassport,
  addInspectionToPassport,
  updateSellingConfig,
  updatePassportShareConfig,
  addTimelineEvent,
  ensureSamplePassport,
  computeDynamicHealthScore,
  getTrustBadgeForPassport,
  generatePassportTransfer,
} from '@/lib/passportStorage';
import { askPassportAI } from '@/lib/api';
import type {
  VehiclePassportData,
  PassportDocCategory,
  PassportChatMessage,
  PassportTimelineItem,
  PassportPhotoItem,
  VehicleInspectionItem,
  SellingProfileConfig,
  PassportShareConfig,
} from '@autoesperto/types';

import AICarScanModal from '@/components/passport/AICarScanModal';
import VehicleGallerySection from '@/components/passport/VehicleGallerySection';
import Vehicle3DViewer from '@/components/passport/Vehicle3DViewer';
import DocumentVerificationModal from '@/components/passport/DocumentVerificationModal';
import SellingModeModal from '@/components/passport/SellingModeModal';
import ShareProfileModal from '@/components/passport/ShareProfileModal';
import HealthScoreModal from '@/components/passport/HealthScoreModal';

export default function PassportDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [passport, setPassport] = useState<VehiclePassportData | null>(null);
  const [activeTab, setActiveTab] = useState<'panoramica' | 'scanner_foto' | 'documenti' | 'timeline' | 'chat'>('panoramica');

  // Modals state
  const [showKmModal, setShowKmModal] = useState(false);
  const [newKmInput, setNewKmInput] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showSellingModal, setShowSellingModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferCode, setTransferCode] = useState('');
  const [transferCopied, setTransferCopied] = useState(false);

  // Vehicle Edit Modal
  const [showVehicleEditModal, setShowVehicleEditModal] = useState(false);
  const [editMake, setEditMake] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editVersion, setEditVersion] = useState('');
  const [editYear, setEditYear] = useState<number>(2020);
  const [editFuel, setEditFuel] = useState('');
  const [editTransmission, setEditTransmission] = useState('');
  const [editPower, setEditPower] = useState('');
  const [editDisplacement, setEditDisplacement] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editEuroClass, setEditEuroClass] = useState('');
  const [editPlate, setEditPlate] = useState('');

  const openVehicleEditModal = () => {
    if (!passport) return;
    const v = passport.vehicle;
    setEditMake(v.make || '');
    setEditModel(v.model || '');
    setEditVersion(v.version || '');
    setEditYear(v.year || 2020);
    setEditFuel(v.fuel || '');
    setEditTransmission(v.transmission || '');
    setEditPower(v.power || '');
    setEditDisplacement(v.displacement || '');
    setEditBody(v.body || '');
    setEditColor(v.color || '');
    setEditEuroClass(v.euroClass || '');
    setEditPlate(v.plate || '');
    setShowVehicleEditModal(true);
  };

  const handleSaveVehicleEdit = () => {
    if (!passport) return;
    const updated: VehiclePassportData = {
      ...passport,
      vehicle: {
        ...passport.vehicle,
        make: editMake || passport.vehicle.make,
        model: editModel || passport.vehicle.model,
        version: editVersion,
        year: editYear,
        fuel: editFuel,
        transmission: editTransmission,
        power: editPower,
        displacement: editDisplacement,
        body: editBody,
        color: editColor,
        euroClass: editEuroClass,
        plate: editPlate,
      },
      nickname: `${editMake || passport.vehicle.make} ${editModel || passport.vehicle.model}`,
      updatedAt: new Date().toISOString(),
    };
    savePassport(updated);
    setPassport(updated);
    setShowVehicleEditModal(false);
  };

  const handleOpenTransfer = () => {
    if (!passport) return;
    const code = generatePassportTransfer(passport.id);
    setTransferCode(code);
    setShowTransferModal(true);
  };

  // Add Manual Timeline Event Modal
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventKm, setEventKm] = useState('');
  const [eventType, setEventType] = useState<PassportTimelineItem['type']>('TAGLIANDO');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCost, setEventCost] = useState('');

  // AI Chat States
  const [chatMessages, setChatMessages] = useState<PassportChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let p = getPassportById(id);
    if (!p) {
      const sample = ensureSamplePassport();
      if (sample.id === id || id === 'sample' || id === 'pass-bmw-320d-sample') {
        p = sample;
      }
    }
    if (p) {
      setPassport(p);
      setNewKmInput(String(p.currentKm));

      // Initial welcome message in chat
      setChatMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `Ciao! Sono il tuo assistente AI dedicato a questa **${p.vehicle.make} ${p.vehicle.model}**.\n\nConosco lo storico dei tuoi tagliandi, i chilometri attuali (${p.currentKm.toLocaleString('it-IT')} km), le scadenze e le specifiche tecniche della vettura. Come posso aiutarti oggi?`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [id]);

  if (!passport) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <SiteHeader />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Profilo Digitale non trovato</h1>
          <p className="text-xs text-slate-500 mb-6">
            Questo profilo auto non è presente nella memoria locale di questo dispositivo o è stato eliminato.
          </p>
          <Link
            href="/passport"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
          >
            Vai al tuo Garage
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const v = passport.vehicle;
  const health = passport.healthBreakdown || computeDynamicHealthScore(passport);
  const mainPhoto =
    passport.mainPhoto ||
    passport.photos?.[0]?.url ||
    v.imageUrl ||
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';

  const handleUpdateKm = () => {
    const num = Number(newKmInput);
    if (!num || num <= 0) return;
    const updated = updatePassportKm(passport.id, num);
    if (updated) setPassport(updated);
    setShowKmModal(false);
  };

  const handleSaveInspection = (inspection: Omit<VehicleInspectionItem, 'id'>) => {
    const updated = addInspectionToPassport(passport.id, inspection);
    if (updated) setPassport(updated);
  };

  const handleAddPhoto = (photo: Omit<PassportPhotoItem, 'id'>) => {
    const updated = addPhotoToPassport(passport.id, photo);
    if (updated) setPassport(updated);
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = deletePhotoFromPassport(passport.id, photoId);
    if (updated) setPassport(updated);
  };

  const handleConfirmDocument = (doc: any) => {
    const updated = addDocumentToPassport(passport.id, doc);
    if (updated) setPassport(updated);
  };

  const handleDeleteDocument = (docId: string) => {
    const updated = removeDocumentFromPassport(passport.id, docId);
    if (updated) setPassport(updated);
  };

  const handleSaveSellingConfig = (cfg: SellingProfileConfig) => {
    const updated = updateSellingConfig(passport.id, cfg);
    if (updated) setPassport(updated);
  };

  const handleUpdateShareConfig = (cfg: Partial<PassportShareConfig>) => {
    const updated = updatePassportShareConfig(passport.id, cfg);
    if (updated) setPassport(updated);
  };

  const handleAddTimelineEvent = () => {
    if (!eventTitle) return;
    const updated = addTimelineEvent(passport.id, {
      date: eventDate,
      km: eventKm ? Number(eventKm) : undefined,
      type: eventType,
      title: eventTitle,
      description: eventDescription || undefined,
      cost: eventCost ? Number(eventCost) : undefined,
    });
    if (updated) setPassport(updated);
    setShowAddEventModal(false);
    setEventTitle('');
    setEventDescription('');
    setEventCost('');
    setEventKm('');
  };

  const handleSendChatMessage = async (customText?: string) => {
    const textToSend = typeof customText === 'string' ? customText : chatInput;
    if (!textToSend.trim() || isChatSending) return;
    const userMsg: PassportChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setChatInput('');
    setIsChatSending(true);

    try {
      const res = await askPassportAI(passport, userMsg.content, chatMessages);
      if (res.success && res.data) {
        setChatMessages((prev) => [...prev, res.data]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            role: 'assistant',
            content: `Ciao! Sulla tua ${v.make} ${v.model} (${passport.currentKm.toLocaleString('it-IT')} km), ti consiglio di verificare lo stato di usura dei componenti prima di procedere. Vuoi che ti aiuti a stimare il costo dei ricambi o preferisci un preventivo per il meccanico?`,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          content: `In base ai dati della tua ${v.make} ${v.model}, la manutenzione ordinaria è la chiave per mantenere alto l'Health Score (${health.totalScore}/100) e il valore di mercato residuo. Hai notato comportamenti anomali o rumori insoliti durante la guida?`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsChatSending(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  // Group timeline by year
  const timelineByYear: Record<string, PassportTimelineItem[]> = {};
  passport.timeline.forEach((item) => {
    const y = item.date ? item.date.slice(0, 4) : 'Storico';
    if (!timelineByYear[y]) timelineByYear[y] = [];
    timelineByYear[y].push(item);
  });
  const sortedYears = Object.keys(timelineByYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Breadcrumb & Privacy Guarantee */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/passport" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> I miei Profili Auto (Garage)
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">{passport.nickname}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Privato: Dati memorizzati sul tuo dispositivo</span>
          </div>
        </div>

        {/* 1. HERO — DIGITAL VEHICLE PROFILE (Apple Wallet / Consumer Aesthetic) */}
        <section className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl p-5 sm:p-7 space-y-6">
          <div className="grid lg:grid-cols-[1.25fr_1fr] gap-6 items-center">
            {/* Left: Car Title, Specs & Market Value */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Profilo Digitale Auto · {passport.shareCode}
                </div>
                {/* AutoEsperto Trust Layer Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                  getTrustBadgeForPassport(passport).colorClass
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {getTrustBadgeForPassport(passport).label}
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  {v.make} {v.model}
                </h1>
                {v.version && (
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                    {v.version}
                  </p>
                )}
              </div>

              {/* Spec Badges Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {v.year && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    Anno {v.year}
                  </span>
                )}
                {v.fuel && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-slate-500" /> {v.fuel}
                  </span>
                )}
                {v.transmission && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {v.transmission}
                  </span>
                )}
                {v.power && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {v.power}
                  </span>
                )}
                {v.displacement && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {v.displacement}
                  </span>
                )}
                {v.body && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {v.body}
                  </span>
                )}
                {v.color && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-slate-500" /> {v.color}
                  </span>
                )}
                {v.euroClass && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {v.euroClass}
                  </span>
                )}
                {v.plate && (
                  <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-xl font-mono font-bold">
                    {v.plate}
                  </span>
                )}

                {/* Edit Vehicle Button */}
                <button
                  onClick={openVehicleEditModal}
                  className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Pencil className="w-3.5 h-3.5" /> Modifica Dati Auto
                </button>
              </div>

              {/* KM & Market Value Row */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Chilometraggio
                    </span>
                    <button
                      onClick={() => setShowKmModal(true)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Aggiorna
                    </button>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {passport.currentKm.toLocaleString('it-IT')} km
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Aggiornato al {passport.lastKmDate}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Valore di Mercato
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {passport.estimatedValue ? `${passport.estimatedValue.toLocaleString('it-IT')} €` : 'N/D'}
                    {passport.estimatedValueMax && (
                      <span className="text-xs font-semibold text-slate-400 ml-1">
                        – {passport.estimatedValueMax.toLocaleString('it-IT')} €
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Stima AutoEsperto basata sugli annunci</p>
                </div>
              </div>
            </div>

            {/* Right: Main Car Image & Health Score Badge */}
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-16/10 bg-slate-950 shadow-md">
                <img
                  src={mainPhoto}
                  alt={`${v.make} ${v.model}`}
                  className="w-full h-full object-cover"
                />

                {/* Health Score Pill overlay */}
                <div
                  onClick={() => setShowHealthModal(true)}
                  className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl text-white flex items-center gap-2.5 cursor-pointer hover:bg-slate-900 transition-all shadow-lg"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
                    {health.totalScore}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-extrabold tracking-wider text-blue-300">
                      Vehicle Health Score
                    </div>
                    <div className="text-xs font-black text-white flex items-center gap-1">
                      {health.label} <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Selling badge if enabled */}
                {passport.sellingConfig?.enabled && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1 shadow-md">
                    <Tag className="w-3 h-3" /> In Vendita · {passport.sellingConfig.askingPrice ? `${passport.sellingConfig.askingPrice.toLocaleString('it-IT')} €` : 'Trattabile'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowShareModal(true)}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Share2 className="w-4 h-4" /> Condividi Profilo &amp; QR
            </button>

            <button
              onClick={() => setShowScanModal(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all"
            >
              <Camera className="w-4 h-4" /> AI Car Scan &amp; Foto
            </button>

            <button
              onClick={() => setShowDocModal(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4" /> Carica Tagliando / Doc
            </button>

            <button
              onClick={handleOpenTransfer}
              className="py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 text-indigo-600" /> Trasferisci a Nuovo Acquirente
            </button>

            <button
              onClick={() => setShowSellingModal(true)}
              className="py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-2 transition-colors ml-auto"
            >
              <Tag className="w-4 h-4 text-emerald-600" /> Prepara per la Vendita
            </button>
          </div>
        </section>

        {/* 2. NAVIGATION TABS */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('panoramica')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'panoramica'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" /> Panoramica &amp; Stato
          </button>

          <button
            onClick={() => setActiveTab('scanner_foto')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'scanner_foto'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" /> AI Car Scan, Foto &amp; 3D ({passport.photos?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('documenti')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'documenti'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Documenti &amp; Tagliandi ({passport.documents?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" /> Timeline di Vita ({passport.timeline?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" /> Assistente AI Auto
          </button>
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB A: PANORAMICA */}
        {activeTab === 'panoramica' && (
          <div className="space-y-6">
            {/* Deadlines / Reminders */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Prossime Scadenze &amp; Manutenzione
                </h2>
                <span className="text-xs text-slate-500 font-medium">Notifiche automatiche attive</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3.5">
                {passport.reminders.map((rem) => {
                  const isExpired = rem.daysRemaining !== undefined && rem.daysRemaining < 0;
                  const isSoon = rem.daysRemaining !== undefined && rem.daysRemaining <= 30 && rem.daysRemaining >= 0;
                  return (
                    <div
                      key={rem.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isExpired
                          ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                          : isSoon
                          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">
                          {rem.type}
                        </span>
                        {isExpired ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">
                            Scaduto
                          </span>
                        ) : rem.daysRemaining !== undefined ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                            Tra {rem.daysRemaining} giorni
                          </span>
                        ) : null}
                      </div>

                      <p className="text-xs font-bold mt-2 truncate">{rem.title}</p>
                      {rem.dueDate && (
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">Scadenza: {rem.dueDate}</p>
                      )}
                      {rem.dueKm && (
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Previsto a: {rem.dueKm.toLocaleString('it-IT')} km ({rem.kmRemaining} km rimasti)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* AI Car Scan Findings & Recent Damages */}
            {passport.inspections?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> Risultati AI Car Scan ({passport.inspections.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab('scanner_foto')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Vedi tutte le foto e ispezioni
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-3.5">
                  {passport.inspections.slice(0, 3).map((insp) => (
                    <div
                      key={insp.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-500">{insp.angleLabel}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            insp.status === 'rilevato'
                              ? insp.severity === 'ottimo'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {insp.status === 'rilevato' ? (insp.severity === 'ottimo' ? 'Ottimo' : 'Rilevato') : insp.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{insp.component}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {insp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Timeline Preview */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Ultimi Eventi Registrati
                </h2>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Vedi tutta la timeline
                </button>
              </div>

              <div className="space-y-2.5">
                {passport.timeline.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                        {item.type === 'TAGLIANDO' ? '🔧' : item.type === 'PNEUMATICI' ? '🛞' : item.type === 'REVISIONE' ? '📋' : '🚗'}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.date} {item.km ? `· ${item.km.toLocaleString('it-IT')} km` : ''}</p>
                      </div>
                    </div>
                    {item.cost && (
                      <span className="text-xs font-black text-slate-900 dark:text-white shrink-0">
                        {item.cost} €
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB B: SCANNER, FOTO & 3D */}
        {activeTab === 'scanner_foto' && (
          <div className="space-y-8">
            {/* 3D Visualizer Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-blue-600" /> Visualizzazione 3D &amp; 360° Interattiva
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ruota la macchina in 3D per ispezionare gli angoli e i punti di controllo.
                  </p>
                </div>
              </div>

              <Vehicle3DViewer
                make={v.make}
                model={v.model}
                color={v.color}
                mainPhoto={mainPhoto}
                hasDamages={passport.inspections?.some((i) => i.severity && i.severity !== 'ottimo')}
              />
            </section>

            {/* AI Car Scan Launch Banner */}
            <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" /> Scansione Guidata AI
                </div>
                <h3 className="text-base sm:text-lg font-black">AI Car Scan a 9 Angolazioni</h3>
                <p className="text-xs text-blue-100 leading-relaxed max-w-lg">
                  Fotografa frontale, retro, fiancate, interni, cruscotto, gomme e motore per aggiornare l&apos;ispezione e il punteggio Health Score.
                </p>
              </div>
              <button
                onClick={() => setShowScanModal(true)}
                className="px-5 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs shadow-md hover:bg-blue-50 transition-all shrink-0 flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-blue-600" /> Avvia Scansione AI
              </button>
            </section>

            {/* Full Photo Gallery */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" /> Galleria Fotografica Digitale ({passport.photos?.length || 0} foto)
              </h2>
              <VehicleGallerySection
                photos={passport.photos || []}
                onAddPhoto={handleAddPhoto}
                onDeletePhoto={handleDeletePhoto}
              />
            </section>
          </div>
        )}

        {/* TAB C: DOCUMENTI */}
        {activeTab === 'documenti' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Documenti, Libretto &amp; Fatture Tagliandi
                </h2>
                <p className="text-xs text-slate-500">
                  Documenti certificati memorizzati in modo privato e sicuro sul tuo profilo.
                </p>
              </div>
              <button
                onClick={() => setShowDocModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" /> Carica documento / fattura
              </button>
            </div>

            {passport.documents?.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Nessun documento caricato
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Carica fatture di tagliandi, libretto o revisioni: l&apos;OCR AI estrarrà date e km e aumenterà il tuo Health Score.
                </p>
                <button
                  onClick={() => setShowDocModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
                >
                  Carica primo documento
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3.5">
                {passport.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                          <FileText className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-600">{doc.category}</span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{doc.fileName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                        title="Elimina documento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 font-medium">
                      <span>{doc.eventDate || 'Data N/D'} {doc.km ? `· ${doc.km.toLocaleString('it-IT')} km` : ''}</span>
                      {doc.amount && <span className="font-bold text-slate-900 dark:text-white">{doc.amount} €</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB D: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Timeline &amp; Storico di Vita dell&apos;Auto
                </h2>
                <p className="text-xs text-slate-500">
                  Cronologia completa di immatricolazione, tagliandi, revisioni, gomme e interventi.
                </p>
              </div>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" /> Aggiungi evento manuale
              </button>
            </div>

            {/* Chronological year groups */}
            <div className="space-y-6 pt-2">
              {sortedYears.map((year) => (
                <div key={year} className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black">
                    Anno {year}
                  </div>

                  <div className="space-y-2.5 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                    {timelineByYear[year].map((evt) => (
                      <div
                        key={evt.id}
                        className="relative pl-6 py-1 space-y-1"
                      >
                        <span className="absolute -left-[17px] top-2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{evt.date}</span>
                        </div>
                        {evt.km && (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {evt.km.toLocaleString('it-IT')} km
                          </span>
                        )}
                        {evt.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {evt.description}
                          </p>
                        )}
                        {evt.cost && (
                          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            Spesa: {evt.cost} €
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB E: ASSISTENTE AI */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Assistente AI {v.make} {v.model}
                  </h3>
                  <p className="text-xs text-slate-500">Chiedi consigli su manutenzione, costi ricambi o anomalie</p>
                </div>
              </div>
            </div>

            {/* Chat message flow */}
            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0">Suggeriti:</span>
              {[
                'Cambiare pastiglie freni',
                'Spia motore accesa',
                'Quanto costa il tagliando?',
                'Quando fare la distribuzione?',
                'Fischiano in frenata',
                'Fai-da-te o Meccanico?',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendChatMessage(chip)}
                  disabled={isChatSending}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 shrink-0 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Es. Quando devo cambiare la cinghia? Quanto costa il prossimo tagliando?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                className="flex-1 h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                disabled={!chatInput.trim() || isChatSending}
                onClick={() => handleSendChatMessage()}
                className="px-5 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs"
              >
                Invia
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {showScanModal && (
        <AICarScanModal
          isOpen={showScanModal}
          onClose={() => setShowScanModal(false)}
          onSaveInspection={handleSaveInspection}
          carName={`${v.make} ${v.model}`}
        />
      )}

      {showDocModal && (
        <DocumentVerificationModal
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
          onConfirmDocument={handleConfirmDocument}
        />
      )}

      {showSellingModal && (
        <SellingModeModal
          isOpen={showSellingModal}
          onClose={() => setShowSellingModal(false)}
          passport={passport}
          onSaveSellingConfig={handleSaveSellingConfig}
        />
      )}

      {showShareModal && (
        <ShareProfileModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          passport={passport}
          onUpdateShareConfig={handleUpdateShareConfig}
        />
      )}

      {showHealthModal && (
        <HealthScoreModal
          isOpen={showHealthModal}
          onClose={() => setShowHealthModal(false)}
          breakdown={health}
          carName={`${v.make} ${v.model}`}
        />
      )}

      {/* KM Update Modal */}
      {showKmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Aggiorna Chilometraggio Attuale
            </h3>
            <p className="text-xs text-slate-500">
              Inserisci i chilometri effettivi segnati sul cruscotto della tua {v.make} {v.model}.
            </p>
            <input
              type="number"
              value={newKmInput}
              onChange={(e) => setNewKmInput(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold bg-slate-50 dark:bg-slate-800"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600"
              >
                Annulla
              </button>
              <button
                onClick={handleUpdateKm}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                Salva Km
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Aggiungi Evento alla Timeline
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Titolo intervento
                </label>
                <input
                  type="text"
                  placeholder="Es. Cambio olio e filtro / Sostituzione pastiglie freni"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Tipo evento
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="TAGLIANDO">Tagliando</option>
                    <option value="REVISIONE">Revisione</option>
                    <option value="PNEUMATICI">Pneumatici</option>
                    <option value="RIPARAZIONE">Riparazione</option>
                    <option value="ASSICURAZIONE">Assicurazione</option>
                    <option value="ALTRO">Altro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Chilometri (opzionale)
                  </label>
                  <input
                    type="number"
                    placeholder="Es. 80000"
                    value={eventKm}
                    onChange={(e) => setEventKm(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Costo sostenuto (€)
                  </label>
                  <input
                    type="number"
                    placeholder="Es. 250"
                    value={eventCost}
                    onChange={(e) => setEventCost(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Descrizione (opzionale)
                </label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600"
              >
                Annulla
              </button>
              <button
                disabled={!eventTitle}
                onClick={handleAddTimelineEvent}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs"
              >
                Salva evento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TRANSFER MODAL ─── */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 grid place-items-center">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Trasferisci Passport</h3>
                  <span className="text-[10px] text-slate-500 block">Passaggio di proprietà digitale</span>
                </div>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Stai vendendo la tua <strong>{v.make} {v.model}</strong>? Comunica questo codice al nuovo proprietario per trasferirgli lo storico dei tagliandi, la documentazione e l&apos;identità digitale dell&apos;auto.
            </p>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-center space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Codice Univoco di Trasferimento
              </span>
              <div className="text-2xl font-black font-mono tracking-widest text-indigo-950 dark:text-white select-all">
                {transferCode}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(transferCode);
                    setTransferCopied(true);
                    setTimeout(() => setTransferCopied(false), 2500);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all"
              >
                {transferCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {transferCopied ? 'Codice Copiato!' : 'Copia Codice'}
              </button>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <p>• Il nuovo acquirente potrà riscattare il profilo inserendo questo codice su <strong>autoesperto.it/passport</strong>.</p>
              <p>• Nessun dato personale (tuo nome, indirizzo o telefono) viene condiviso.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* ─── VEHICLE EDIT MODAL ─── */}
      {showVehicleEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-scale-in my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white grid place-items-center shadow-md">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Modifica Dati Auto</h3>
                  <p className="text-[10px] text-slate-500">Tutti i campi sono modificabili e salvati localmente</p>
                </div>
              </div>
              <button
                onClick={() => setShowVehicleEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Identità */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Marca</label>
                  <input type="text" value={editMake} onChange={(e) => setEditMake(e.target.value)} placeholder="Es. BMW" className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Modello</label>
                  <input type="text" value={editModel} onChange={(e) => setEditModel(e.target.value)} placeholder="Es. Serie 3" className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Versione / Allestimento</label>
                <input type="text" value={editVersion} onChange={(e) => setEditVersion(e.target.value)} placeholder="Es. 320d M-Sport, 2.0 TDI R-Line" className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              </div>

              {/* Anno & Targa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Anno</label>
                  <select value={editYear} onChange={(e) => setEditYear(parseInt(e.target.value, 10))} className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((y) => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Targa</label>
                  <input type="text" value={editPlate} onChange={(e) => setEditPlate(e.target.value.toUpperCase())} placeholder="Es. AB123CD" className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold font-mono uppercase focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
              </div>

              {/* Carburante */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Carburante</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Diesel', 'Benzina', 'Ibrida', 'GPL', 'Metano', 'Elettrica'].map((f) => (
                    <button key={f} type="button" onClick={() => setEditFuel(f)} className={`h-9 px-2 rounded-xl text-xs font-bold border transition-all ${editFuel === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>{f}</button>
                  ))}
                </div>
              </div>

              {/* Cambio */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Trasmissione</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Manuale', 'Automatico'].map((t) => (
                    <button key={t} type="button" onClick={() => setEditTransmission(t)} className={`h-9 px-3 rounded-xl text-xs font-bold border transition-all ${editTransmission === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Potenza, Cilindrata */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Potenza</label>
                  <input type="text" value={editPower} onChange={(e) => setEditPower(e.target.value)} placeholder="Es. 150 CV" className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Cilindrata</label>
                  <input type="text" value={editDisplacement} onChange={(e) => setEditDisplacement(e.target.value)} placeholder="Es. 1998 cc" className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
              </div>

              {/* Carrozzeria, Colore, Euro */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Carrozzeria</label>
                  <select value={editBody} onChange={(e) => setEditBody(e.target.value)} className="w-full h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                    <option value="">—</option>
                    {['Berlina', 'SUV', 'SW', 'Coupé', 'Cabrio', 'Monovolume', 'Utilitaria', 'Furgone'].map((b) => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Colore</label>
                  <input type="text" value={editColor} onChange={(e) => setEditColor(e.target.value)} placeholder="Es. Nero" className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Classe Euro</label>
                  <select value={editEuroClass} onChange={(e) => setEditEuroClass(e.target.value)} className="w-full h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                    <option value="">—</option>
                    {['Euro 6d', 'Euro 6d-TEMP', 'Euro 6c', 'Euro 6b', 'Euro 6', 'Euro 5', 'Euro 4', 'Euro 3'].map((e) => (<option key={e} value={e}>{e}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowVehicleEditModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSaveVehicleEdit}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <Save className="w-4 h-4" /> Salva Modifiche
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
