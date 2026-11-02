'use client';
import PaymentMethods from '@/components/PaymentMethods';
import { isBatteryElectric, resolveVehicleFuel } from '@/lib/powertrain';


import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Car,
  Check,
  ChevronRight,
  Link2,
  Loader2,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
  MapPin,
  ExternalLink,
  Globe,
  Gauge,
  Calendar,
  Fuel,
  Info,
  Edit3,
} from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import {
  API_URL,
  freeScanVehiclePhoto,
  freeScanManual,
  prepareFreeTrial,
  getMyAccount,
  createCheckout,
  confirmCheckout,
  confirmSubscription,
  createReportCheckout,
  getReportCredits,
  getProSubscriptionStatus,
  getUnlockedReport,
  unlockWithCredit,
  unlockWithPro,
  getReportPreview,
  type FreeScanResult,
  type AccountUser,
  type AnalyzePayload,
} from '@/lib/api';
import { optimiseImageForAnalysis } from '@/lib/imageOptim';
import { resolveVehicleImage } from '@/lib/vehicleImageResolver';
import { REGIONS_CONFIG } from '@/lib/bollo';
import { trackEvent } from '@/lib/analytics';
import { fireAdsPurchase } from '@/components/AdsTracker';
import ReportView from '@/components/ReportView';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import { parseListingTextOrUrl, fetchAndParseAd, type ParsedAdData } from '@/lib/adParser';
import {
  getAllMakes,
  getModelsForMake,
  getTrimVersionsForModel,
  POPULAR_MAKES_ITALY,
} from '@/lib/catalogo';

const POPULAR_CHIPS = [
  { make: 'Fiat', model: 'Panda' },
  { make: 'Fiat', model: '500' },
  { make: 'Volkswagen', model: 'Golf' },
  { make: 'Toyota', model: 'Yaris' },
  { make: 'Renault', model: 'Clio' },
  { make: 'Peugeot', model: '208' },
  { make: 'Ford', model: 'Puma' },
  { make: 'Jeep', model: 'Renegade' },
];

const AVAILABLE_YEARS = Array.from({ length: 32 }, (_, i) => 2026 - i);
const QUICK_KM_CHIPS = [20000, 45000, 75000, 100000, 130000, 160000, 200000];

type ScannerStage = 'idle' | 'recognition' | 'vehicle-found' | 'result' | 'error' | 'manual-input';

type ManualAnalysisInput = {
  mode?: 'model' | 'photo' | 'listing';
  make: string;
  model: string;
  year: number;
  km: number;
  requestedPrice?: number;
  fuel?: string;
  transmission?: string;
  version?: string;
  imageData?: string;
};

const PENDING_ANALYSIS_KEY = 'autoesperto.pending-analysis.v1';
const PENDING_REPORT_PREVIEW_KEY = 'autoesperto.report-preview.v1';

const promises = ['Stima indicativa', 'Confronto con annunci disponibili', 'Affidabilità e difetti noti', 'Stima del bollo', 'Controlli pre-acquisto'];

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function VehicleScanner({
  embedded = false,
  initialMode = 'manual',
  initialAd,
  initialPayload,
  onStageChange,
}: {
  embedded?: boolean;
  initialMode?: 'foto' | 'manual' | 'annuncio';
  initialAd?: string;
  initialPayload?: AnalyzePayload;
  onStageChange?: (stage: ScannerStage) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<ScannerStage>('idle');

  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);
  useEffect(() => {
    let cancelled = false;
    try {
      const stored = window.sessionStorage.getItem(PENDING_REPORT_PREVIEW_KEY);
      if (!stored) return;
      const { reportId, accessToken } = JSON.parse(stored) as { reportId: string; accessToken: string };
      if (!reportId || !accessToken) return;
      void getReportPreview(reportId, accessToken).then(({ preview }) => {
        if (cancelled) return;
        setScan({ success: true, recognized: true, mode: 'model', vehicle: { make: preview.vehicle.make, model: preview.vehicle.model, year: preview.vehicle.year, fuel: preview.vehicle.fuel, confidence: preview.confidence }, preview });
        setManualMake(preview.vehicle.make);
        setManualModel(preview.vehicle.model);
        if (preview.vehicle.year) setManualYear(String(preview.vehicle.year));
        if (preview.requestedPrice != null) setManualPrice(String(preview.requestedPrice));
        setStage('result');
      }).catch(() => {
        try { window.sessionStorage.removeItem(PENDING_REPORT_PREVIEW_KEY); } catch {}
      });
    } catch { /* storage may be unavailable or malformed */ }
    return () => { cancelled = true; };
  }, []);
  const [tab, setTab] = useState<'foto' | 'manual' | 'annuncio'>(initialMode);
  const [adInput, setAdInput] = useState('');
  const [parsedAd, setParsedAd] = useState<ParsedAdData | null>(null);
  const [isParsingAd, setIsParsingAd] = useState(false);
  const parseDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const adRequestRef = useRef(0);
  const adEditedFieldsRef = useRef(new Set<string>());

  const [photos, setPhotos] = useState<string[]>([]);
  const [mainPhoto, setMainPhoto] = useState('');
  const [scan, setScan] = useState<FreeScanResult | null>(null);
  const viewedPreviewsRef = useRef(new Set<string>());
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState('');
  const [manualMake, setManualMake] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualVersion, setManualVersion] = useState('');
  const [customModelMode, setCustomModelMode] = useState(false);
  const [customVersionMode, setCustomVersionMode] = useState(false);
  const [manualYear, setManualYear] = useState('');
  const [manualKm, setManualKm] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualFuel, setManualFuel] = useState('');
  const [manualTransmission, setManualTransmission] = useState('Manuale');
  const [manualRegion, setManualRegion] = useState('lombardia');
  const [manualLoading, setManualLoading] = useState(false);
  const submitInFlight = useRef(false);
  const [analysisId, setAnalysisId] = useState('');
  const [waitSeconds, setWaitSeconds] = useState(0);
  useEffect(() => {
    if (!manualLoading) { setWaitSeconds(0); return; }
    const timer = setInterval(() => setWaitSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(timer);
  }, [manualLoading]);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [accountResolved, setAccountResolved] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState('');
  const [pendingAnalysis, setPendingAnalysis] = useState<ManualAnalysisInput | null>(null);
  const [paymentGate, setPaymentGate] = useState<'login' | 'payment' | null>(null);
  useEffect(() => {
    const preview = scan?.preview;
    if (!preview || viewedPreviewsRef.current.has(preview.reportId)) return;
    viewedPreviewsRef.current.add(preview.reportId);
    trackEvent('preview_viewed', { reportId: preview.reportId, confidence: preview.confidence });
    trackEvent('report_offer_viewed', { reportId: preview.reportId, singlePriceCents: 199, packPriceCents: 499 });
  }, [scan?.preview]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const resumeStartedRef = useRef(false);
  const reportCheckoutResumeRef = useRef(false);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [proReportsRemaining, setProReportsRemaining] = useState(0);

  // Catalog computations
  const allCatalogMakes = useMemo(() => getAllMakes().map((m) => m.name), []);
  const popularMakes = useMemo(
    () => POPULAR_MAKES_ITALY.filter((m) => allCatalogMakes.some((cm) => cm.toLowerCase() === m.toLowerCase())),
    [allCatalogMakes]
  );
  const otherMakes = useMemo(
    () => allCatalogMakes.filter((m) => !POPULAR_MAKES_ITALY.some((p) => p.toLowerCase() === m.toLowerCase())),
    [allCatalogMakes]
  );
  const availableModels = useMemo(() => {
    if (!manualMake) return [];
    return getModelsForMake(manualMake);
  }, [manualMake]);

  const availableVersions = useMemo(() => {
    if (!manualMake || !manualModel || manualModel === '__custom__') return [];
    return getTrimVersionsForModel(manualMake, manualModel);
  }, [manualMake, manualModel]);

  useEffect(() => {
    const selectModel = () => {setTab('manual');setPaymentGate(null);};
    window.addEventListener('ae-select-free-model',selectModel);
    return () => window.removeEventListener('ae-select-free-model',selectModel);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
    void prepareFreeTrial();
    getMyAccount().then(res => {
      if (res.success && res.user) {
        setUser(res.user);
      }
    }).catch(() => {}).finally(() => setAccountResolved(true));
  }, []);

  useEffect(() => {
    if (!initialPayload?.make || !initialPayload?.model) return;
    setTab('manual');
    setManualMake(initialPayload.make);
    setManualModel(initialPayload.model);
    if (initialPayload.year) setManualYear(String(initialPayload.year));
    if (initialPayload.km) setManualKm(String(initialPayload.km));
    if (initialPayload.requestedPrice) setManualPrice(String(initialPayload.requestedPrice));
    const timer = setTimeout(() => {
      void handleManualSubmit({
        make: initialPayload.make,
        model: initialPayload.model,
        year: initialPayload.year,
        km: initialPayload.km,
        requestedPrice: initialPayload.requestedPrice,
      });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{if(tab!=='annuncio'){adRequestRef.current++;if(parseDebounceTimerRef.current)clearTimeout(parseDebounceTimerRef.current);setIsParsingAd(false);}},[tab]);

  useEffect(() => {
    if (initialAd) {setTab('annuncio');handleAdInputChange(initialAd);}
  }, [initialAd]);

  const handleAdInputChange = (value: string) => {
    const requestId=++adRequestRef.current;
    adEditedFieldsRef.current.clear();
    setAdInput(value);setError('');setMainPhoto('');setPhotos([]);
    const local=parseListingTextOrUrl(value);setParsedAd(local);
    setManualMake(local.make || '');setManualModel(local.model || '');setManualVersion(local.version || '');
    setManualYear(local.year!=null ? String(local.year) : '');setManualKm(local.km!=null ? String(local.km) : '');setManualPrice(local.price!=null ? String(local.price) : '');
    setManualFuel(resolveVehicleFuel(local.make,local.model,local.fuel) || '');setManualTransmission(local.transmission || '');
    if(parseDebounceTimerRef.current)clearTimeout(parseDebounceTimerRef.current);
    if(!/^https?:\/\//i.test(value.trim())){setIsParsingAd(false);return;}
    setIsParsingAd(true);
    parseDebounceTimerRef.current=setTimeout(async()=>{
      try{
        const remote=await fetchAndParseAd(value.trim());
        if(adRequestRef.current!==requestId)return;
        setParsedAd(remote);
        const apply=(field:string,setter:(value:string)=>void,value:unknown)=>{if(value!=null&&!adEditedFieldsRef.current.has(field))setter(String(value));};
        apply('make',setManualMake,remote.make);apply('model',setManualModel,remote.model);apply('version',setManualVersion,remote.version);
        apply('year',setManualYear,remote.year);apply('km',setManualKm,remote.km);apply('price',setManualPrice,remote.price);
        apply('fuel',setManualFuel,resolveVehicleFuel(remote.make,remote.model,remote.fuel));apply('transmission',setManualTransmission,remote.transmission);
        if(remote.photo){setMainPhoto(remote.photo);setPhotos([remote.photo]);}
      }catch{if(adRequestRef.current===requestId)setError('Lettura non disponibile: completa o correggi i dati dell’annuncio.');}
      finally{if(adRequestRef.current===requestId)setIsParsingAd(false);}
    },400);
  };
  const handleAnalyzeAd = async () => {
    if(submitInFlight.current || isParsingAd)return;
    setError('');
    if(!manualMake.trim() || !manualModel.trim()){setError('Conferma marca e modello nei campi dell’annuncio.');return;}
    if(!manualPrice.trim() || !(Number(manualPrice)>0)){setError('Conferma il prezzo richiesto nell’annuncio prima del confronto.');return;}
    await handleManualSubmit({mode:'listing',make:manualMake.trim(),model:manualModel.trim(),year:manualYear ? Number(manualYear) : undefined,km:manualKm!=='' ? Number(manualKm) : undefined,requestedPrice:Number(manualPrice),fuel:resolveVehicleFuel(manualMake,manualModel,manualFuel),transmission:manualTransmission,version:manualVersion});
  };

  const reset = () => {
    adRequestRef.current++;
    setManualFuel('');setManualTransmission('');
    setPhotos([]); setMainPhoto(''); setScan(null); setReport(null); setError(''); setStage('idle');
    setManualMake(''); setManualModel(''); setManualVersion(''); setManualYear(''); setManualLoading(false);
    setManualKm(''); setManualPrice(''); setAdInput(''); setParsedAd(null);
    setIsParsingAd(false); setCustomModelMode(false); setCustomVersionMode(false);
    if (parseDebounceTimerRef.current) clearTimeout(parseDebounceTimerRef.current);
    if (inputRef.current) inputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyResult = async (result: FreeScanResult, photoUrl: string) => {
    if (!result.recognized || !result.vehicle) return false;
    setScan(result);
    setReport(null);
    setMainPhoto(photoUrl);
    setManualMake(result.vehicle.make || '');
    setManualModel(result.vehicle.model || '');
    if (result.vehicle.year) setManualYear(String(result.vehicle.year));
    if (result.vehicle.fuel) setManualFuel(result.vehicle.fuel);
    
    const isEv = isBatteryElectric(result.vehicle.make, result.vehicle.model, result.vehicle.fuel);
    if (isEv) {
      setManualTransmission('Automatico');
    }

    trackEvent('car_selected', { make: result.vehicle.make || '', model: result.vehicle.model || '' });
    setStage('vehicle-found');
    return true;
  };

  useEffect(() => {
    if (!user) { setAvailableCredits(0); setProReportsRemaining(0); return; }
    void getReportCredits().then((result) => setAvailableCredits(result.remaining)).catch(() => setAvailableCredits(0));
    void getProSubscriptionStatus().then(({ subscription }) => setProReportsRemaining(subscription?.status === 'ACTIVE' ? subscription.reportsRemaining : 0)).catch(() => setProReportsRemaining(0));
  }, [user]);

  useEffect(() => {
    if (!accountResolved || !user || !scan?.preview || reportCheckoutResumeRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('report_checkout') !== 'success') return;
    const sessionId = params.get('session_id');
    if (!sessionId) return;
    reportCheckoutResumeRef.current = true;
    void (async () => {
      try {
        const confirmation = await confirmCheckout(sessionId);
        if (!confirmation.paid) throw new Error('Il pagamento è ancora in elaborazione. Riprova tra poco.');
        const { report: unlocked } = await getUnlockedReport(scan.preview!.reportId);
        setReport(unlocked);
        fireAdsPurchase(confirmation.amountCents / 100, confirmation.currency.toUpperCase(), sessionId);
        trackEvent('report_unlocked', { reportId: scan.preview!.reportId, source: 'single_purchase' });
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('report_checkout'); cleanUrl.searchParams.delete('session_id'); cleanUrl.searchParams.delete('report');
        window.history.replaceState({}, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Non riesco a verificare il pagamento.');
        reportCheckoutResumeRef.current = false;
      }
    })();
  }, [accountResolved, user, scan]);

  const startReportCheckout = async (product: 'single_report' | 'report_pack_3') => {
    trackEvent('unlock_clicked', { product, reportId: product === 'single_report' ? scan?.preview?.reportId : undefined });
    if (!user) {
      try { window.sessionStorage.setItem(PENDING_REPORT_PREVIEW_KEY, JSON.stringify({ reportId: scan?.preview?.reportId, accessToken: scan?.preview?.accessToken })); } catch {}
      router.push('/accesso?next=/');
      setError('Accedi o crea un account per acquistare e ritrovare i report.');
      return;
    }
    if (product === 'single_report' && !scan?.preview) return;
    setCheckoutLoading(true);
    setError('');
    trackEvent('report_purchase_started', { product, reportId: scan?.preview?.reportId });
    try {
      const checkout = await createReportCheckout({
        product,
        ...(product === 'single_report' && scan?.preview ? { reportId: scan.preview.reportId, accessToken: scan.preview.accessToken, returnTo: `/?report=${encodeURIComponent(scan.preview.reportId)}` } : { returnTo: '/account?credits=success' }),
      });
      window.location.assign(checkout.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout di prova non disponibile.');
      setCheckoutLoading(false);
    }
  };

  const unlockPreviewWithCredit = async () => {
    if (!user || !scan?.preview || !availableCredits) return;
    trackEvent('unlock_clicked', { product: 'report_credit', reportId: scan.preview.reportId });
    setCheckoutLoading(true); setError('');
    try {
      const result = await unlockWithCredit(scan.preview.reportId, scan.preview.accessToken);
      setReport(result.report);
      setAvailableCredits((count) => Math.max(0, count - 1));
      trackEvent('report_unlocked', { reportId: scan.preview!.reportId, source: 'credit' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Non riesco a sbloccare il report.');
    } finally { setCheckoutLoading(false); }
  };

  const unlockPreviewWithPro = async () => {
    if (!user || !scan?.preview || proReportsRemaining < 1) return;
    trackEvent('unlock_clicked', { product: 'autoesperto_pro', reportId: scan.preview.reportId });
    setCheckoutLoading(true); setError('');
    try {
      const result = await unlockWithPro(scan.preview.reportId, scan.preview.accessToken);
      setReport(result.report);
      setProReportsRemaining((count) => Math.max(0, count - 1));
      trackEvent('report_unlocked', { reportId: scan.preview.reportId, source: 'pro' });
    } catch (err) { setError(err instanceof Error ? err.message : 'Non riesco a usare la quota PRO.'); }
    finally { setCheckoutLoading(false); }
  };

  const handleFiles = async (files: FileList | null) => {
    let selectedPhoto = '';
    if (!files || files.length === 0) return;
    setError(''); setScan(null); setReport(null); setManualLoading(true);

    const valid = Array.from(files).filter((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return false;
      return file.size <= MAX_PHOTO_BYTES;
    }).slice(0, MAX_PHOTOS);

    if (valid.length === 0) {
      setError('Carica una o più foto JPG, PNG o WebP (massimo 5 MB l’una).');
      setManualLoading(false);
      return;
    }

    trackEvent('car_image_uploaded', { count: valid.length });
    try {
      const imageDatas = await Promise.all(valid.map(optimiseImageForAnalysis));
      setPhotos(imageDatas);
      setMainPhoto(imageDatas[0]);
      selectedPhoto = imageDatas[0];
      trackEvent('photo_recognition_started', { photos: imageDatas.length });

      // Una sola foto basta per identificare marca e modello. Analizzarle una
      // dopo l'altra rendeva l'attesa proporzionale al numero di allegati.
      const recognitionImage = imageDatas[0];
      const result = await freeScanVehiclePhoto(recognitionImage);
      trackEvent(result.recognized ? 'photo_recognition_completed' : 'photo_recognition_failed', { reason: result.recognized ? undefined : 'not_recognized' });
      if (await applyResult(result, recognitionImage)) {
        setManualLoading(false);
        return;
      }
      // Se non riconosciuta, passa al tab manuale con messaggio
      setTab('manual');
      setError(result.message || 'Non siamo riusciti a identificare il modello esatto dalla foto. Inserisci marca e modello per il report.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      const status = (err as {status?:number}).status;
      if (status === 401 || status === 402) {
        setPendingPhoto(selectedPhoto);
        try { window.sessionStorage.setItem('autoesperto.pending-photo.v1',selectedPhoto); } catch {}
        setPaymentGate(status === 401 ? 'login' : 'payment');
        setError('Questa anteprima non è disponibile in questo momento. Puoi continuare gratis inserendo marca e modello.');
        return;
      }
      setTab('manual');
      setError(msg || 'Inserisci marca e modello qui sotto per calcolare subito il valore.');
    } finally {
      setManualLoading(false);
    }
  };

  const handleManualSubmit = async (overrides?: Partial<ManualAnalysisInput>) => {
    if (submitInFlight.current) return;
    const make = overrides?.make?.trim() || manualMake.trim();
    const model = overrides?.model?.trim() || manualModel.trim();
    if (!make || !model) {
      setError('Inserisci almeno marca e modello.');
      return;
    }

    const year = overrides?.year ?? (manualYear.trim() ? Number(manualYear.trim()) : undefined);
    const km = overrides?.km ?? (manualKm.trim() ? Number(manualKm.trim()) : undefined);
    if (!year || !Number.isInteger(year) || year < 1950 || year > new Date().getFullYear() + 1) {
      setError('Inserisci l’anno di immatricolazione: serve a identificare la generazione corretta.');
      return;
    }
    if (km === undefined || !Number.isFinite(km) || km < 0 || km > 1000000 || !Number.isInteger(km)) {
      setError('Inserisci i km effettivi: incidono direttamente sulla stima del prezzo.');
      return;
    }

    const requestedPrice = overrides?.requestedPrice ?? (manualPrice.trim() ? Number(manualPrice.trim()) : undefined);
    const analysisInput: ManualAnalysisInput = {
      mode: overrides?.mode || (tab === 'annuncio' ? 'listing' : stage === 'vehicle-found' ? 'photo' : 'model'),
      make,
      model,
      year,
      km,
      ...(requestedPrice && !isNaN(requestedPrice) ? { requestedPrice } : {}),
      ...(resolveVehicleFuel(make,model,overrides?.fuel || manualFuel) ? { fuel: resolveVehicleFuel(make,model,overrides?.fuel || manualFuel) } : {}),
      ...(overrides?.transmission || manualTransmission ? { transmission: overrides?.transmission || manualTransmission } : {}),
      ...(overrides?.version || manualVersion ? { version: overrides?.version || manualVersion } : {}),
      // The vehicle is confirmed: do not send its photo through recognition again.
    };

    setManualLoading(true); setError(''); setPaymentGate(null);
    submitInFlight.current = true;
    const attemptId = crypto.randomUUID();
    const startedAt = Date.now();
    setAnalysisId(attemptId);
    trackEvent('analysis_started', { analysis_type: tab, make, model, analysisId: attemptId });
    try {
      const result = await freeScanManual(analysisInput);
      if (!result.recognized || !result.vehicle || !result.preview) {
        trackEvent('analysis_failed', { analysisId: attemptId, reason: 'missing_preview' });
        setError(result.message || 'Non riesco a riconoscere il veicolo. Riprova.');
        setStage('idle');
        return;
      }
      setScan(result);
      setReport(null);
      try { window.sessionStorage.setItem(PENDING_REPORT_PREVIEW_KEY, JSON.stringify({ reportId: result.preview.reportId, accessToken: result.preview.accessToken })); } catch {}
      trackEvent('car_selected', { make: result.vehicle.make, model: result.vehicle.model });
      setStage('result');
      trackEvent('analysis_completed', { make: result.vehicle.make, model: result.vehicle.model, analysisId: attemptId, durationMs: Date.now() - startedAt });
      try { window.sessionStorage.removeItem(PENDING_ANALYSIS_KEY); } catch {}
      setPendingAnalysis(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      const status = (err as Error & { status?: number }).status;
      trackEvent('analysis_failed', { analysisId: attemptId, status: status || 0, reason: status === 401 ? 'trial_used_login_required' : status === 402 ? 'payment_required' : status === 429 ? 'rate_limited' : err instanceof Error && err.name === 'AbortError' ? 'timeout' : status ? 'http_' + status : 'network_error', durationMs: Date.now() - startedAt });
      if (status === 401 || status === 402) {
        setPendingAnalysis(analysisInput);
        setPaymentGate(status === 401 ? 'login' : 'payment');
        setStage('idle');
        setError(status === 401
          ? 'Accedi per recuperare la tua anteprima. La valutazione per marca e modello resta gratuita.'
          : 'Anteprima temporaneamente non disponibile. Puoi sempre valutare gratis per marca e modello.');
        try { window.sessionStorage.setItem(PENDING_ANALYSIS_KEY, JSON.stringify(analysisInput)); } catch { /* storage may be unavailable */ }
        return;
      }
      if (msg.includes('impiegando troppo tempo') || msg.includes('500') || msg.includes('servizio')) {
        setError('Il server sta elaborando la richiesta. Riprova tra pochi istanti.');
      } else {
        setError(msg || 'Errore durante la generazione del report. Riprova.');
      }
      setStage('idle');
    } finally {
      submitInFlight.current = false;
      setManualLoading(false);
    }
  };

  const continueToCheckout = async () => {
    try {
      if (pendingAnalysis) window.sessionStorage.setItem(PENDING_ANALYSIS_KEY, JSON.stringify(pendingAnalysis));
      if (pendingPhoto) window.sessionStorage.setItem('autoesperto.pending-photo.v1',pendingPhoto);
      router.push('/prezzi-preview');
    } catch { setError('Non riesco a conservare i dati in questo browser. Puoi riprendere l’analisi dalla home.'); }
  };
  const continueToAccount = () => { void continueToCheckout(); };

  useEffect(() => {
    if (!accountResolved || resumeStartedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const checkoutState = params.get('checkout');
    const subscriptionState = params.get('subscription');
    const shouldResume = params.get('resumeAnalysis') === '1' || checkoutState === 'success' || subscriptionState === 'success';
    const wasCancelled = checkoutState === 'cancelled' || subscriptionState === 'cancelled';
    if (!shouldResume && !wasCancelled) return;

    let pending: ManualAnalysisInput | null = null;
    try {
      const raw = window.sessionStorage.getItem(PENDING_ANALYSIS_KEY);
      if (raw) pending = JSON.parse(raw) as ManualAnalysisInput;
    } catch { /* ignore invalid session data */ }
    if (!pending) {
      let photo = '';
      try { photo = window.sessionStorage.getItem('autoesperto.pending-photo.v1') || ''; } catch {}
      if (!photo) {
        if (subscriptionState === 'success') setError('AutoEsperto AI attivato. Puoi iniziare dalla tua foto o dal tuo annuncio.');
        return;
      }
      resumeStartedRef.current = true;
      setPendingPhoto(photo);
      setTab('foto');
      setManualLoading(true);
      void (async () => {
        try {
          const sessionId = params.get('session_id');
          if (subscriptionState === 'success' && sessionId) await confirmSubscription(sessionId);
          const result = await freeScanVehiclePhoto(photo);
          if (await applyResult(result,photo)) {
            window.sessionStorage.removeItem('autoesperto.pending-photo.v1');
            setPendingPhoto('');setPaymentGate(null);
          } else {setError(result.message || 'Riprova con una foto più nitida.');}
        } catch (err) {setPaymentGate((err as {status?:number}).status === 401 ? 'login' : 'payment');setError(err instanceof Error ? err.message : 'Attiva AI per continuare.');}
        finally {setManualLoading(false);}
      })();
      return;
    }
    if (checkoutState === 'success' && !user) {
      setPendingAnalysis(pending);
      setPaymentGate('login');
      setError('Accedi con lo stesso account per verificare il pagamento e riprendere l’analisi.');
      return;
    }

    resumeStartedRef.current = true;
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('checkout');
    cleanUrl.searchParams.delete('subscription');
    cleanUrl.searchParams.delete('session_id');
    cleanUrl.searchParams.delete('resumeAnalysis');
    window.history.replaceState({}, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
    setPendingAnalysis(pending);
    setManualMake(pending.make);
    setManualModel(pending.model);
    setManualYear(String(pending.year));
    setManualKm(String(pending.km));
    if (pending.imageData) {
      setMainPhoto(pending.imageData);
      setPhotos([pending.imageData]);
    }
    if (pending.requestedPrice) setManualPrice(String(pending.requestedPrice));
    if (pending.fuel) setManualFuel(pending.fuel);
    if (pending.transmission) setManualTransmission(pending.transmission);
    if (pending.version) setManualVersion(pending.version);

    const resume = async () => {
      if (subscriptionState === 'success') {
        const sessionId = params.get('session_id');
        try {
          if (sessionId) await confirmSubscription(sessionId);
          const account = await getMyAccount(true);
          setUser(account.user);
        } catch (err) {setPaymentGate('payment');setError(err instanceof Error ? err.message : 'Attivazione non verificata.');return;}
      }
      if (checkoutState === 'success') {
        const sessionId = params.get('session_id');
        if (!sessionId || !user) {
          setPaymentGate('login');
          setError('Accedi con lo stesso account per verificare il pagamento e riprendere l’analisi.');
          return;
        }
        try {
          const confirmation = await confirmCheckout(sessionId);
          if (confirmation.paid) {
            fireAdsPurchase(confirmation.amountCents / 100, confirmation.currency.toUpperCase(), sessionId);
          }
          if (!confirmation.paid) {
            setPaymentGate('payment');
            setError('Il pagamento è ancora in elaborazione. Riprova tra qualche istante.');
            return;
          }
          const account = await getMyAccount(true);
          if (account.success) setUser(account.user);
        } catch (err) {
          setPaymentGate('payment');
          setError(err instanceof Error ? err.message : 'Non riesco a verificare il pagamento.');
          return;
        }
      } else if (wasCancelled) {
        setPaymentGate(user ? 'payment' : 'login');
        setError('Pagamento annullato. La tua auto è ancora pronta per l’analisi.');
        return;
      } else if (!user) {
        setPaymentGate('login');
        setError('Accedi per riprendere l’analisi AI. Il modello resta gratuito.');
        return;
      }

      window.sessionStorage.removeItem(PENDING_ANALYSIS_KEY);
      setPaymentGate(null);
      window.setTimeout(() => { void handleManualSubmit(pending); }, 0);
    };
    void resume();
  }, [accountResolved, user]);

  const [isDragOver, setIsDragOver] = useState(false);
  const paywallNotice = paymentGate && (pendingAnalysis || pendingPhoto) ? (
    <div className="mx-3 my-3 rounded-2xl border border-blue-200 bg-blue-50 p-4" role="status">
      <h3 className="text-base font-extrabold text-slate-950">Continua la valutazione</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">L’anteprima è gratuita. Un report completo costa 1,99 €; il pacchetto da 4,99 € include 3 report acquistati + 1 in omaggio, senza rinnovo.</p>
      <button type="button" onClick={() => void continueToCheckout()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white">Confronta prezzi e report <ArrowRight className="h-4 w-4" /></button>
      <button type="button" onClick={() => {setTab('manual');setPaymentGate(null);setStage('idle');setError('');}} className="mt-3 block min-h-10 text-sm font-bold text-blue-700">Oppure valuta per modello, gratis</button>
      <p className="mt-1 text-xs text-slate-500">Puoi iniziare dall’anteprima senza account né pagamento.</p>
    </div>
  ) : null;

  if (stage === 'vehicle-found' && scan?.vehicle) {
    return (
      <div className="p-4 sm:p-6 text-center max-w-xl mx-auto space-y-5 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
          <Check className="w-3.5 h-3.5" /> Veicolo Identificato
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {scan.vehicle.make} {scan.vehicle.model}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-md mx-auto leading-relaxed">
            Conferma anno, km e alimentazione: sono necessari per distinguere la generazione e calcolare un prezzo attendibile.
          </p>
        </div>

        {mainPhoto && (
          <div className="relative w-36 h-24 mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mainPhoto} alt={`${scan.vehicle.make} ${scan.vehicle.model}`} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <label className="scanner-field">
            <span>Anno di immatricolazione *</span>
            <input
              type="number"
              value={manualYear}
              onChange={(e) => setManualYear(e.target.value)}
              placeholder="es. 2017"
              min={1990}
              max={2027}
            />
          </label>
          <label className="scanner-field">
            <span>Km effettivi *</span>
            <input
              type="number"
              value={manualKm}
              onChange={(e) => setManualKm(e.target.value)}
              placeholder="es. 95000"
              min={0}
            />
          </label>
          <label className="scanner-field">
            <span>Versione / allestimento</span>
            <input
              type="text"
              value={manualVersion}
              onChange={(e) => setManualVersion(e.target.value)}
              placeholder="es. Hybrid, Long Range, 1.6 TDI"
            />
          </label>
          <label className="scanner-field">
            <span>Prezzo (€ opz.)</span>
            <input
              type="number"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
              placeholder="es. 11500"
              min={0}
            />
          </label>
        </div>

        <div className="text-left">
          <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Alimentazione *</span>
          <div className="flex flex-wrap gap-1.5">
            {['Benzina', 'Diesel', 'Ibrida', 'Elettrica', 'GPL', 'Metano'].map((fuel) => (
              <button
                key={fuel}
                type="button"
                onClick={() => {
                  setManualFuel(fuel);
                  if (fuel === 'Elettrica') setManualTransmission('Automatico');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  manualFuel.toLowerCase().includes(fuel.toLowerCase())
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="scanner-box-error" role="alert">{error}</p>}

        <div className="space-y-2 pt-2">
          <button
            type="button"
            disabled={manualLoading}
            onClick={() => {
              const v = scan.vehicle;
              if (!v?.make || !v?.model) return;
              void handleManualSubmit({
                make: v.make,
                model: v.model,
                year: manualYear.trim() ? Number(manualYear.trim()) : undefined,
                km: manualKm.trim() ? Number(manualKm.trim()) : undefined,
                requestedPrice: manualPrice.trim() ? Number(manualPrice.trim()) : undefined,
              });
            }}
            className="scanner-submit w-full"
          >
            {manualLoading ? (
              <><Loader2 className="animate-spin" /> Calcolo score accurato…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Calcola Score Accurato & Report <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

        </div>
      </div>
    );
  }

  if (stage !== 'result') {
    if (embedded) {
      return (
        <div className="scanner-box shadow-xl border border-slate-200/90 rounded-2xl overflow-hidden">
          {paywallNotice}
          {/* App-like Segmented Pill Bar */}
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl m-2.5 flex items-center gap-1.5" role="tablist" aria-label="Come vuoi analizzare l'auto">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'manual'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                tab === 'manual'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => { setTab('manual'); setError(''); }}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${tab === 'manual' ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white/70 text-slate-600'}`} aria-hidden="true">
                <Car className="h-4 w-4 stroke-[1.8]" />
              </span>
              <span>Modello <small className="block text-[9px] text-emerald-700">Gratis</small></span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'foto'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                tab === 'foto'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => { setTab('foto'); setError(''); }}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${tab === 'foto' ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white/70 text-slate-600'}`} aria-hidden="true">
                <Camera className="h-4 w-4 stroke-[1.8]" />
              </span>
              <span className="inline-flex items-center gap-1.5">Foto <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-blue-700"><Sparkles className="h-3 w-3" aria-hidden="true" />AI</span></span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'annuncio'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                tab === 'annuncio'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => { setTab('annuncio'); setError(''); }}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${tab === 'annuncio' ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white/70 text-slate-600'}`} aria-hidden="true">
                <Link2 className="h-4 w-4 stroke-[1.8]" />
              </span>
              <span>Annuncio</span>
            </button>
          </div>

          {tab === 'foto' ? (
            <div className="p-3 sm:p-5">
              <button
                type="button"
                disabled={manualLoading}
                className={`scanner-dropzone group ${isDragOver ? 'ring-4 ring-blue-500/20 border-blue-600 bg-blue-50/50' : ''} ${manualLoading ? 'opacity-75 cursor-wait' : ''}`}
                onClick={() => !manualLoading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (!manualLoading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    void handleFiles(e.dataTransfer.files);
                  }
                }}
              >
                <span className="scanner-drop-icon transition-transform group-hover:scale-110">
                  {manualLoading ? <Loader2 className="h-7 w-7 animate-spin text-blue-600" /> : <Camera className="h-7 w-7 text-blue-600" />}
                </span>
                <span className="scanner-drop-main text-base sm:text-lg font-black text-slate-900">
                  {manualLoading ? 'Analisi foto / screenshot con IA…' : isDragOver ? 'Rilascia qui le immagini' : 'Carica foto o screenshot dell\'annuncio'}
                </span>
                <span className="scanner-drop-sub text-xs text-slate-500 max-w-sm text-center">
                  {manualLoading ? 'Riconoscimento automatico e generazione del verdetto in corso…' : 'Trascina qui l\'immagine, oppure tocca per scattare da fotocamera smartphone'}
                </span>
                {!manualLoading && (
                  <span className="scanner-drop-sub text-[11px] text-slate-400 max-w-md text-center mt-0.5 block">
                    Funziona con AutoScout24, Subito.it, Facebook Marketplace e la maggior parte dei portali auto
                  </span>
                )}

                <span className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105 active:scale-95">
                  <Upload className="w-4 h-4" />
                  Scegli file o scatta foto
                </span>
              </button>

              {error && <p className="scanner-box-error mt-3" role="alert">{error}</p>}

              {/* 1-Click Interactive AI Presets */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-600 stroke-[1.8]" />
                    Non hai una foto adesso? Prova un esempio:
                  </span>
                  <span className="hidden sm:inline text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    Esempi reali
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { make: 'Fiat', model: 'Panda', year: 2019, km: 65000, price: 8900, tag: 'Panda', label: 'Fiat Panda' },
                    { make: 'Volkswagen', model: 'Golf', year: 2018, km: 120000, price: 11800, tag: '7 TDI', label: 'Golf 7 TDI' },
                    { make: 'Toyota', model: 'Yaris', year: 2021, km: 42000, price: 16400, tag: 'Hybrid', label: 'Yaris Hybrid' },
                    { make: 'Jeep', model: 'Renegade', year: 2018, km: 95000, price: 13800, tag: 'Renegade', label: 'Jeep Renegade' },
                  ].map((demo) => (
                    <button
                      key={`${demo.make}-${demo.model}`}
                      type="button"
                      disabled={manualLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setManualMake(demo.make);
                        setManualModel(demo.model);
                        setManualYear(String(demo.year));
                        setManualKm(String(demo.km));
                        setManualPrice(String(demo.price));
                        void handleManualSubmit({
                          make: demo.make,
                          model: demo.model,
                          year: demo.year,
                          km: demo.km,
                          requestedPrice: demo.price,
                        });
                      }}
                      className="p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-blue-50/80 hover:border-blue-300 transition-all text-left group shadow-xs cursor-pointer active:scale-98"
                    >
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">{demo.tag}</span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors block truncate">
                        {demo.label}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {demo.year} · {demo.km.toLocaleString('it-IT')} km
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="scanner-box-micro text-[11px] text-slate-400 mt-3 text-center">Anteprima gratis da foto, annuncio o modello. Report completi da 1,99 €.</p>
            </div>
          ) : tab === 'manual' ? (
            <form className="p-3 sm:p-5" onSubmit={event => {event.preventDefault();void handleManualSubmit({mode:'model'});}}>
              <div className="grid grid-cols-2 gap-3">
                <label className="scanner-field min-w-0"><span>Marca *</span><select aria-label="Marca" required value={manualMake} onChange={e=>{setManualMake(e.target.value);setManualModel('');setCustomModelMode(false);setManualVersion('');}}><option value="">Scegli marca</option>{allCatalogMakes.map(make=><option key={make} value={make}>{make}</option>)}</select></label>
                <label className="scanner-field min-w-0"><span>Modello *</span>{customModelMode?<input aria-label="Modello" required value={manualModel} onChange={e=>setManualModel(e.target.value)} placeholder="Nome modello" />:<select aria-label="Modello" required disabled={!manualMake} value={manualModel} onChange={e=>{if(e.target.value==='__custom__'){setCustomModelMode(true);setManualModel('');}else{setManualModel(e.target.value);setManualVersion('');}}}><option value="">Scegli modello</option>{availableModels.map(model=><option key={model} value={model}>{model}</option>)}<option value="__custom__">Altro modello…</option></select>}</label>
                <label className="scanner-field min-w-0"><span>Anno *</span><input aria-label="Anno" type="number" inputMode="numeric" required min={1950} max={new Date().getFullYear()+1} value={manualYear} onChange={e=>setManualYear(e.target.value)} placeholder="es. 2019" /></label>
                <label className="scanner-field min-w-0"><span>Chilometri *</span><input aria-label="Chilometri" type="number" inputMode="numeric" required min={0} max={1000000} value={manualKm} onChange={e=>setManualKm(e.target.value)} placeholder="es. 75000" /></label>
                <label className="scanner-field col-span-2"><span>Alimentazione *</span><select aria-label="Alimentazione" required value={manualFuel} onChange={e=>{setManualFuel(e.target.value);if(e.target.value==='Elettrica')setManualTransmission('Automatico');}}><option value="">Scegli alimentazione</option>{['Benzina','Diesel','Ibrida','Elettrica','GPL','Metano'].map(fuel=><option key={fuel}>{fuel}</option>)}</select></label>
              </div>
              <details className="mt-3 rounded-xl border border-slate-200 px-3 py-2.5"><summary className="cursor-pointer text-xs font-bold text-slate-600">Prezzo richiesto e altri dettagli (facoltativi)</summary><div className="mt-3 grid grid-cols-2 gap-3">
                <label className="scanner-field"><span>Prezzo richiesto (€)</span><input aria-label="Prezzo richiesto" type="number" min={0} value={manualPrice} onChange={e=>setManualPrice(e.target.value)} placeholder="es. 9500" /></label>
                <label className="scanner-field"><span>Cambio</span><select value={manualTransmission} onChange={e=>setManualTransmission(e.target.value)}><option>Manuale</option><option>Automatico</option></select></label>
                <label className="scanner-field col-span-2"><span>Versione / allestimento</span><input value={manualVersion} onChange={e=>setManualVersion(e.target.value)} placeholder="es. 1.2 Lounge" /></label>
                <label className="scanner-field col-span-2"><span>Regione per il bollo</span><select value={manualRegion} onChange={e=>setManualRegion(e.target.value)}>{Object.values(REGIONS_CONFIG).map(region=><option key={region.id} value={region.id}>{region.name}</option>)}</select></label>
              </div></details>
              {error&&<p className="scanner-box-error mt-3" role="alert">{error}</p>}
              <button type="submit" className="scanner-submit mt-4 w-full" disabled={manualLoading}>{manualLoading?<><Loader2 className="animate-spin" /> Calcolo in corso…</>:<>Valuta questo modello gratis <ArrowRight /></>}</button>
            </form>
          ) : (
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Incolla il link dell&apos;annuncio o il testo dell&apos;offerta:
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    AutoScout24 · Subito · Autohero · Marketplace
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    aria-label="Link o testo dell’annuncio"
                    rows={3}
                    value={adInput}
                    onChange={(e) => handleAdInputChange(e.target.value)}
                    placeholder="Incolla qui il link di AutoScout24, Subito.it, Autohero, Facebook Marketplace o copia il testo dell'annuncio (es. 'Fiat Panda 1.2 Lounge 2021 45.000 km 9.500 €')..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 outline-none transition-all resize-none shadow-xs"
                  />
                  {adInput && (
                    <button
                      type="button"
                      onClick={() => handleAdInputChange('')}
                      className="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md transition-colors"
                    >
                      Pulisci
                    </button>
                  )}
                </div>
              </div>

              {/* Status Parsing Live Feedback */}
              {isParsingAd && (
                <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex items-center gap-3 animate-pulse">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      Connessione all&apos;annuncio in corso…
                    </p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400">
                      Stiamo leggendo marca, modello, km, prezzo e foto per il calcolo automatico.
                    </p>
                  </div>
                </div>
              )}

              {/* Rich Extracted Card Preview */}
              {!isParsingAd && parsedAd && adInput.trim() && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                      <Car className="w-4 h-4 text-blue-600 stroke-[1.8]" />
                      Dati rilevati dall&apos;annuncio:
                    </div>
                    {parsedAd.source && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {parsedAd.source}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    {parsedAd.photo ? (
                      <div className="relative w-full sm:w-28 h-20 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={parsedAd.photo}
                          alt={parsedAd.title || 'Foto annuncio'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {[manualMake, manualModel, parsedAd.version || manualVersion].filter(Boolean).join(' ')}
                      </h4>
                      {parsedAd.title && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {parsedAd.title}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2 text-[11px] font-semibold">
                        {(manualMake) && (
                          <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                            Marca: <strong>{manualMake}</strong>
                          </span>
                        )}
                        {(manualModel) && (
                          <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                            Modello: <strong>{manualModel}</strong>
                          </span>
                        )}
                        {(manualYear) && (
                          <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                            Anno: <strong>{manualYear}</strong>
                          </span>
                        )}
                        {(manualKm) && (
                          <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                            Km: <strong>{Number(manualKm).toLocaleString('it-IT')}</strong>
                          </span>
                        )}
                        {(manualPrice) && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                            Prezzo: <strong>{Number(manualPrice).toLocaleString('it-IT')} €</strong>
                          </span>
                        )}
                        {(resolveVehicleFuel(manualMake,manualModel,manualFuel)) && (
                          <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                            {resolveVehicleFuel(manualMake,manualModel,manualFuel)}
                          </span>
                        )}
                        {parsedAd.city && (
                          <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            📍 {parsedAd.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {parsedAd.message && <p className="my-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">{parsedAd.message}</p>}
                  <p className="my-3 text-xs leading-relaxed text-slate-600">Controlla questi dati prima dell’analisi. I campi mancanti non vengono inventati; le tue correzioni hanno la precedenza.</p>
                  <div className="mb-3 grid gap-3 sm:grid-cols-3">{([{key:'make',label:'Marca annuncio',value:manualMake,set:setManualMake},{key:'model',label:'Modello annuncio',value:manualModel,set:setManualModel}] as const).map(field=><label key={field.key} className="text-xs font-semibold text-slate-700">{field.label}<input value={field.value} onChange={e=>{adEditedFieldsRef.current.add(field.key);field.set(e.target.value);}} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"/></label>)}<label className="text-xs font-semibold text-slate-700">Alimentazione annuncio<select value={resolveVehicleFuel(manualMake,manualModel,manualFuel) || ''} onChange={e=>{adEditedFieldsRef.current.add('fuel');setManualFuel(e.target.value);}} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"><option value="">Da confermare</option>{['Benzina','Diesel','Ibrida','GPL','Metano','Elettrica'].map(f=><option key={f}>{f}</option>)}</select></label></div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-left">
                    <label className="text-[10px] font-bold text-slate-500">
                      Anno
                      <input
                        type="number"
                        value={manualYear}
                        onChange={(e) => {adEditedFieldsRef.current.add('year');setManualYear(e.target.value);}}
                        placeholder="es. 2019"
                        className="mt-0.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </label>
                    <label className="text-[10px] font-bold text-slate-500">
                      Km effettivi
                      <input
                        type="number"
                        value={manualKm}
                        onChange={(e) => {adEditedFieldsRef.current.add('km');setManualKm(e.target.value);}}
                        placeholder="es. 75000"
                        className="mt-0.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </label>
                    <label className="text-[10px] font-bold text-slate-500">
                      Prezzo (€)
                      <input
                        type="number"
                        value={manualPrice}
                        onChange={(e) => {adEditedFieldsRef.current.add('price');setManualPrice(e.target.value);}}
                        placeholder="es. 12500"
                        className="mt-0.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </label>
                  </div>
                </div>
              )}

              {error && <p className="scanner-box-error" role="alert">{error}</p>}

              <button
                type="button"
                onClick={handleAnalyzeAd}
                disabled={manualLoading || isParsingAd}
                className="scanner-submit w-full"
              >
                {manualLoading ? (
                  <><Loader2 className="animate-spin" /> Elaborazione analisi e verdetto…</>
                ) : isParsingAd ? (
                  <><Loader2 className="animate-spin" /> Lettura annuncio in corso…</>
                ) : (
                  <><ScanSearch /> Analizza l’annuncio con AI <ArrowRight /></>
                )}
              </button>
              <p className="scanner-box-micro text-[11px] text-slate-400 mt-3 text-center">Anteprima gratis da foto, annuncio o modello. Report completi da 1,99 €.</p>
            </div>
          )}
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
      );
    }

    return (
      <section className="scanner-hero">
        <div className="scanner-glow scanner-glow-one" /><div className="scanner-glow scanner-glow-two" />
        <div className="scanner-hero-copy">
          {paywallNotice}
          <div className="scanner-kicker"><Camera className="h-4 w-4" /> Riconoscimento auto da foto</div>
          <h1>Analizza l’auto.<br className="hidden sm:block" /> Scopri modello e prezzo.</h1>
          <p className="scanner-lead">Da una o più foto riconosciamo marca, modello e anno, stimiamo il prezzo e generiamo un report per quel modello.</p>
           <div className="scanner-promises" aria-label="Informazioni analizzate">
            {promises.map((item) => <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>)}
          </div>
            <button type="button" className="scanner-cta" onClick={() => inputRef.current?.click()}><Camera className="h-5 w-5" /> Analizza la foto con AI <ChevronRight className="h-5 w-5" /></button>
            <p className="scanner-microcopy">Anteprima gratuita da foto e annunci. Report completo da 1,99 €, pagamento una tantum. <a href="/prezzi-preview" className="font-bold underline">Confronta i piani</a></p>
          <p className="mt-4 text-sm">Valuta gratis per modello oppure ottieni un’anteprima da foto e annunci. Sblocca il report completo quando ti serve.</p>
          <div className="scanner-privacy"><ShieldCheck className="h-4 w-4" /> Salviamo il report, non la fotografia originale.</div>
           <p className="mt-3 flex items-start gap-2 text-xs max-w-xl" style={{ color: 'var(--text-2)' }}>
             <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: 'var(--success)' }} />
             <span>Per un risultato migliore: carica più foto (frontale, laterale, posteriore, interni) con buona illuminazione. Il riconoscimento è indicativo e può contenere errori.</span>
           </p>
        </div>
        <div className="scanner-hero-visual" aria-hidden="true">
          <div className="scanner-device">
            <div className="scanner-device-top"><span /><span>Analisi AutoEsperto</span><span /></div>
            <div className="scanner-car-silhouette">
              <svg viewBox="0 0 620 300" fill="none"><path d="M75 205 103 145l104-28 68-61h153l79 63 63 27 29 59-23 31H99Z" stroke="currentColor" strokeWidth="2"/><path d="m207 117 68-61h153l79 63M103 145l116 23h282l69-22M142 205h385M236 117l-17 51m236-51 46 51" stroke="currentColor" strokeWidth="1.4"/><circle cx="180" cy="217" r="43" stroke="currentColor" strokeWidth="2"/><circle cx="494" cy="217" r="43" stroke="currentColor" strokeWidth="2"/></svg>
              <div className="scanner-demo-line" />
              <span className="scanner-point point-a" /><span className="scanner-point point-b" /><span className="scanner-point point-c" />
            </div>
            <div className="scanner-device-status"><span>Riconoscimento visivo</span><strong>Pronto</strong></div>
          </div>
        </div>
        <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} />
      </section>
    );
  }

  if (stage === 'result') {
      const vehicleObj = scan?.preview?.vehicle || scan?.vehicle || report?.vehicle || { make: manualMake || 'Auto', model: manualModel || 'Selezionata' };
    const vehicleName = [vehicleObj.make, vehicleObj.model].filter(Boolean).join(' ');
    const requestedPrice = manualPrice.trim() ? Number(manualPrice.trim()) : undefined;

    return (
      <section className="scanner-result">
        <div className="scanner-result-hero scanner-result-identity">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-200"><img src="/logo-circle.png" alt="AutoEsperto" width={32} height={32} className="h-8 w-8 rounded-full" />La tua analisi</div>
            <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600 px-3 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"><RotateCcw className="h-3.5 w-3.5" />Nuova analisi</button>
          </div>
          <div className="scanner-result-title mt-5">
            <h1>{vehicleName}</h1>
            <p className="!mt-2 !text-slate-300">{[vehicleObj.year,vehicleObj.fuel,manualKm ? Number(manualKm).toLocaleString('it-IT') + ' km' : null].filter(Boolean).join(' · ') || 'Controlla i dati nella scheda del veicolo'}</p>
          </div>
          <p className="mt-4 border-t border-slate-700 pt-3 text-xs leading-relaxed text-slate-300">{scan?.mode === 'model' ? 'Dati indicativi del modello. Prezzo e controlli sono riassunti qui sotto.' : 'Valutazione sui dati disponibili. Conferma anno, chilometri e prezzo prima di decidere.'}</p>
        </div>

        {photos.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Foto caricate">
            {photos.map((photo, i) => (
              <div key={i} className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 ${photo === mainPhoto ? 'border-accent' : 'border-transparent'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={`Foto ${i + 1} dell'auto`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="scanner-result-banner">
          <ShieldCheck className="h-4 w-4" />
          {scan?.mode === 'model' ? <span>Valutazione per modello gratuita. Puoi confrontare altre auto senza account.</span> : user ? (
             <span>{scan?.saved ? 'Analisi salvata nel tuo' : 'Analisi completata. Apri il tuo'} <button type="button" onClick={() => router.push('/account')} className="scanner-result-banner-link">account</button>.</span>
          ) : (
             <span>Analisi completata. <button type="button" onClick={() => router.push('/accesso?next=/account')} className="scanner-result-banner-link">Accedi al tuo account</button> per le prossime analisi.</span>
          )}
        </div>

        {report ? <ReportErrorBoundary onRetry={reset}><ReportView report={report} embedded analysisId={analysisId} /></ReportErrorBoundary> : scan?.preview ? (
          <div className="mt-5 rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-text-primary">La tua anteprima gratuita</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">Affidabilità {scan.preview.confidence}</span>
            </div>
            {scan.preview.requestedPrice != null && <p className="mt-4 text-sm text-text-secondary">Prezzo richiesto: <strong className="text-text-primary">{scan.preview.requestedPrice.toLocaleString('it-IT')} €</strong></p>}
            {scan.preview.marketRange && <p className="mt-3 text-sm text-text-secondary">Valori di annunci simili: <strong className="text-text-primary">{scan.preview.marketRange.min.toLocaleString('it-IT')}–{scan.preview.marketRange.max.toLocaleString('it-IT')} €</strong></p>}
            {scan.preview.firstJudgment && <div className="mt-4 rounded-xl bg-blue-50 p-4"><strong className="text-sm text-blue-950">{scan.preview.firstJudgment.label}</strong><p className="mt-1 text-sm text-blue-900">{scan.preview.firstJudgment.explanation}</p></div>}
            <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4"><strong className="text-sm text-text-primary">Un controllo utile</strong><p className="mt-1 text-sm text-text-secondary">{scan.preview.firstCheck}</p></div>
            {scan.preview.missingData.length > 0 && <p className="mt-4 text-xs text-text-tertiary">Per una stima più precisa: {scan.preview.missingData.join(' · ')}.</p>}
            {scan.preview.limitations.map((limitation) => <p key={limitation} className="mt-3 text-xs leading-relaxed text-text-tertiary">{limitation}</p>)}
            <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white">
              <p className="font-semibold">Vuoi approfondire?</p>
              <p className="mt-1 text-sm text-slate-300">Il report completo sblocca valutazione, confronti, rischi e consigli d’acquisto.</p>
              <button type="button" disabled={checkoutLoading} onClick={() => void startReportCheckout('single_report')} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-70">
                {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{user ? 'Sblocca il report completo — 1,99 €' : 'Accedi per sbloccare — 1,99 €'}
              </button>
              {user && availableCredits > 0 && <button type="button" disabled={checkoutLoading} onClick={() => void unlockPreviewWithCredit()} className="mt-2 min-h-11 w-full rounded-xl border border-slate-600 px-4 text-sm font-semibold text-white disabled:opacity-60">Usa 1 credito ({availableCredits} disponibili)</button>}
              {user && proReportsRemaining > 0 && <button type="button" disabled={checkoutLoading} onClick={() => void unlockPreviewWithPro()} className="mt-2 min-h-11 w-full rounded-xl border border-blue-300/50 bg-blue-500/15 px-4 text-sm font-semibold text-white disabled:opacity-60">Usa 1 report PRO ({proReportsRemaining} disponibili)</button>}
              <button type="button" disabled={checkoutLoading} onClick={() => void startReportCheckout('report_pack_3')} className="mt-2 min-h-11 w-full rounded-xl border border-blue-400/50 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-60">Oppure 4 report · 3 + 1 omaggio — 4,99 €</button>
              {!user && <p className="mt-2 text-center text-xs text-slate-400">Account richiesto per salvare acquisti e crediti.</p>}
              <div className="mt-4 rounded-xl bg-white p-3 text-slate-900"><PaymentMethods compact /></div>
              {error && <p className="mt-3 text-sm text-rose-300" role="alert">{error}</p>}
            </div>
          </div>
        ) : (
            <div className="mt-5 rounded-2xl p-5 border border-border bg-surface shadow-card">
              <h2 className="text-sm font-bold text-text-primary">Veicolo riconosciuto</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ['Marca', vehicleObj.make],
                  ['Modello', vehicleObj.model],
                  ['Versione', (vehicleObj as any).generation],
                  ['Anno', vehicleObj.year],
                  ['Tipologia', (vehicleObj as any).bodyType],
                ]
                  .filter((item) => item[1])
                  .map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl p-3 border border-border bg-surface-2">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-text-tertiary">{label}</span>
                      <strong className="mt-1 block text-sm capitalize text-text-primary">{String(value)}</strong>
                    </div>
                  ))}
              </div>
              {error && <p className="mt-3 text-center text-xs font-semibold text-danger" role="alert">{error}</p>}
            </div>
        )}
        {requestedPrice != null && (
          <p className="text-xs text-text-tertiary mt-4">Prezzo richiesto inserito: {requestedPrice.toLocaleString('it-IT')} €</p>
        )}
      </section>
    );
  }

  // Se non siamo in result, torna sempre al box di ricerca pulito
  return null;
}


