'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AutoReport } from '@autoesperto/types';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { computeScores } from '@/lib/score';
import { repairLegacyElectricReport } from '@/lib/repairReport';
import { freeScanManual } from '@/lib/api';
import type { ReportWithTools } from '@/lib/reportTools';
import { slugify } from '@/lib/catalogo';
import ReportScoreHero from '@/components/ReportScoreHero';
import ReportPdfExport from '@/components/ReportPdfExport';
import MarketPortalCards from '@/components/MarketPortalCards';
import VehicleHistoryHelp from '@/components/VehicleHistoryHelp';
import ReportDisclosure from '@/components/ReportDisclosure';
import ReportQuickCustomizer from '@/components/ReportQuickCustomizer';
import ReliabilityRadar from '@/components/ReliabilityRadar';
import DepreciationChart from '@/components/DepreciationChart';
import ReportDeepAnalysis from '@/components/ReportDeepAnalysis';
import VehicleHealthScore from '@/components/VehicleHealthScore';
import { ShareButton } from '@/components/ShareButton';
import { SellAdGenerator } from '@/components/SellAdGenerator';
import { NearbyServicesLocator } from '@/components/NearbyServicesLocator';
import { createPassportFromReport } from '@/lib/passportStorage';

const euro = (value?: number) => value != null && value > 0 ? `${Math.round(value).toLocaleString('it-IT')} €` : 'Non disponibile';
interface ReportViewProps { report: AutoReport; analysisId?: string; onBack?: () => void; embedded?: boolean; showAds?: boolean; allowPhotoTools?: boolean; }

export default function ReportView(props: ReportViewProps) {
  const { report, analysisId } = props;
  return <ReportViewContent key={`${analysisId || report.createdAt}-${report.vehicle.make}-${report.vehicle.model}-${report.vehicle.year}`} {...props} />;
}

function ReportViewContent({ report, analysisId, onBack, embedded = false }: ReportViewProps) {
  const router = useRouter();
  const viewedRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef('');
  const repaired=repairLegacyElectricReport(report);
  const [currentReport, setCurrentReport] = useState(repaired.report);
  const [needsRefresh,setNeedsRefresh]=useState(repaired.needsRefresh);
  const [refreshing,setRefreshing]=useState(false);
  const [refreshError,setRefreshError]=useState('');
  const [reportRevision, setReportRevision] = useState(0);
  const [isCreatingPassport, setIsCreatingPassport] = useState(false);
  const [passportError, setPassportError] = useState('');
  useEffect(() => {
    const node = viewedRef.current;
    if (!node || !analysisId) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || document.visibilityState !== 'visible' || sentRef.current === analysisId) return;
      sentRef.current = analysisId;
      trackEvent('result_viewed', { analysisId, make: report.vehicle.make, model: report.vehicle.model });
      observer.disconnect();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [analysisId, report]);
  const { vehicle, reliability, price, photoAnalysis } = currentReport;
  const scores = computeScores(currentReport);
  const specs = [
    ['Marca', vehicle.make], ['Modello', vehicle.model], ['Versione', vehicle.version], ['Anno', vehicle.year],
    ['Alimentazione', vehicle.fuel], ['Chilometri', price.inputKm != null ? `${price.inputKm.toLocaleString('it-IT')} km` : undefined],
    ['Potenza', vehicle.power], ['Cilindrata', vehicle.displacement], ['Cambio', vehicle.transmission], ['Carrozzeria', vehicle.body],
    ['Porte', vehicle.doors], ['Colore', vehicle.color], ['Classe Euro', vehicle.euroClass],
  ].filter(([, value]) => value != null && value !== '');
  const createPassport = () => {
    if (isCreatingPassport) return;
    setIsCreatingPassport(true); setPassportError('');
    try { router.push(`/passport/${createPassportFromReport(currentReport).id}`); }
    catch { setPassportError('Non è stato possibile creare il profilo. Riprova.'); setIsCreatingPassport(false); }
  };
  const list = (items: string[] | undefined, empty: string) => items?.length ? <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">{items.map((item, i) => <li key={i}>{item}</li>)}</ul> : <p className="text-sm text-slate-500">{empty}</p>;
  return <div className={`${embedded ? 'scanner-detailed-report max-w-none' : 'mx-auto max-w-3xl'} space-y-3 pb-10 text-slate-900`}>
    <div ref={viewedRef} className="h-px" aria-hidden="true" />
    {onBack && <button onClick={onBack} className="mb-1 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue-700"><ArrowLeft className="h-4 w-4" /> Nuova ricerca</button>}
    {needsRefresh && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-bold text-amber-950">Alimentazione corretta: questa auto è elettrica</p><p className="mt-2 text-sm leading-relaxed text-amber-900">Il vecchio report conteneva un’alimentazione incompatibile. I consumi e i costi non coerenti sono stati rimossi: aggiorna la valutazione per ricalcolarli.</p><button disabled={refreshing} onClick={async()=>{setRefreshing(true);setRefreshError('');try{if(!currentReport.vehicle.year || currentReport.price.inputKm==null)throw Error('Conferma anno e chilometri nella sezione Dati dell’auto per aggiornare il report.');const result=await freeScanManual({mode:'model',make:currentReport.vehicle.make,model:currentReport.vehicle.model,year:currentReport.vehicle.year,km:currentReport.price.inputKm,fuel:'Elettrica',version:currentReport.vehicle.version,requestedPrice:currentReport.price.requestedPrice});if(!result.report)throw Error('Valutazione non disponibile. Riprova.');setCurrentReport(result.report);setReportRevision(v=>v+1);setNeedsRefresh(false);}catch(err){setRefreshError(err instanceof Error ? err.message : 'Riprova tra poco.');}finally{setRefreshing(false);}}} className="mt-3 min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-50">{refreshing ? 'Aggiornamento…' : 'Ricalcola gratis come elettrica'}</button>{refreshError&&<p role="status" className="mt-2 text-sm">{refreshError}</p>}</div>}
    <ReportScoreHero report={currentReport} isModelData={vehicle.dataSource === 'model'} />
    <div className="flex flex-wrap items-center justify-between gap-3 py-3"><h2 className="text-base font-bold text-slate-950">Scegli cosa approfondire</h2><span className="text-xs text-slate-500">Tocca una sezione per aprirla</span></div>

    <ReportDisclosure title="Prezzo e confronto con il mercato" description="Valore stimato, prezzo richiesto, annunci e punteggi">
      <dl className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-blue-50 p-4"><dt className="text-xs text-slate-600">Valore centrale stimato</dt><dd className="mt-1 text-xl font-bold">{euro(price.estimatedValue)}</dd></div><div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-600">Prezzo richiesto</dt><dd className="mt-1 text-xl font-bold">{price.requestedPrice ? euro(price.requestedPrice) : 'Non inserito'}</dd></div></dl>
      {price.comment && <p className="text-sm leading-relaxed text-slate-700">{price.comment}</p>}
      <div><h3 className="mb-3 text-sm font-bold">Come si compone l’indice complessivo</h3><dl className="divide-y divide-slate-100">{[['Prezzo rispetto al mercato', scores.priceScore], ['Affidabilità del modello', scores.reliabilityScore], ['Costi di gestione', scores.costScore], ['Consumi', scores.consumptionScore], ['Indice di rischio acquisto', scores.riskScore]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-2 text-sm"><dt className="text-slate-600">{label}</dt><dd className="shrink-0 font-semibold">{value} / 100</dd></div>)}</dl><p className="mt-2 text-xs leading-relaxed text-slate-500">L’indice è la media di queste cinque voci. Un valore più alto indica una valutazione più favorevole. Le voci prive di dati specifici usano i valori indicativi del modello.</p></div>
      {price.market?.comparison?.disclosure && <p className="text-xs leading-relaxed text-slate-500">{price.market.comparison.disclosure}</p>}
      {!!price.market?.listings?.length && <div><h3 className="mb-2 text-sm font-bold">Annunci di confronto</h3><div className="divide-y divide-slate-100">{price.market.listings.slice(0, 6).map((item) => <a key={item.id} href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-4 py-3 text-sm hover:text-blue-700"><span className="min-w-0"><span className="block font-semibold">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{[item.year, item.km ? `${item.km.toLocaleString('it-IT')} km` : '', item.city].filter(Boolean).join(' · ')}</span></span><span className="shrink-0 font-bold">{euro(item.price)}</span></a>)}</div></div>}
      <MarketPortalCards report={currentReport} />
    </ReportDisclosure>

    <ReportDisclosure title="Affidabilità e controlli da fare" description={photoAnalysis?.damage?.visible ? 'Criticità del modello e segni visibili nelle foto' : 'Punti di forza, criticità e verifiche prima dell’acquisto'}>
      {reliability.summary && <p className="text-sm leading-relaxed text-slate-700">{reliability.summary}</p>}
      <div className="grid gap-5 sm:grid-cols-2"><div><h3 className="mb-2 text-sm font-bold">Punti di forza</h3>{list(reliability.strengths, 'Nessun punto specifico disponibile.')}</div><div><h3 className="mb-2 text-sm font-bold">Criticità da verificare</h3>{list(reliability.weaknesses, 'Nessuna criticità specifica indicata. Verifica comunque l’auto dal vivo.')}</div></div>
      <div><h3 className="mb-2 text-sm font-bold">Checklist prima di decidere</h3>{list(reliability.advice?.length ? reliability.advice : reliability.commonIssues, 'Verifica tagliandi, revisioni e condizioni con un professionista.')}</div>
      {photoAnalysis && <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="text-sm font-bold">Cosa mostrano le foto</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">{photoAnalysis.inspection?.summary || photoAnalysis.damage.description}</p>{photoAnalysis.inspection?.areas?.map((area, i) => <p key={i} className="mt-3 text-sm leading-relaxed"><strong>{area.area}:</strong> {area.details}</p>)}{photoAnalysis.repairRange && <p className="mt-3 text-sm font-semibold">Riparazione indicativa: {euro(photoAnalysis.repairRange.min)} – {euro(photoAnalysis.repairRange.max)}</p>}<p className="mt-3 text-xs leading-relaxed text-slate-500">Attendibilità del controllo visivo: {photoAnalysis.inspection?.confidence || photoAnalysis.vehicle?.confidence || 'bassa'}. {photoAnalysis.inspection?.limitations?.join(' ')} {photoAnalysis.note} Le foto non permettono di certificare lo stato meccanico.</p></div>}
      <div className="grid gap-4 sm:grid-cols-2">{[['Motore', reliability.engine], ['Cambio', reliability.transmission]].filter(([, text]) => text).map(([label, text]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><h3 className="text-sm font-bold">{label}</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">{text}</p></div>)}</div>
      {reliability.categoryScores && <ReportDisclosure title="Affidabilità per componente" description="Motore, cambio, elettronica, sospensioni e carrozzeria"><ReliabilityRadar categoryScores={reliability.categoryScores} /></ReportDisclosure>}
      <ReportDisclosure title="Simula spese e controlla le foto" description="Spese da discutere nel prezzo; analisi foto con abbonamento"><VehicleHealthScore key={`${reportRevision}-${currentReport.vehicle.make}-${currentReport.vehicle.model}-${currentReport.vehicle.year}-${currentReport.price.inputKm}`} report={currentReport} onValuationAdjust={(newPrice, deduction, note) => setCurrentReport(prev => ({ ...prev, price: newPrice, userTools: { ...(prev as ReportWithTools).userTools, conditionSimulation: deduction > 0 ? { baseValue: newPrice.estimatedValue + deduction, deduction, note } : undefined } } as ReportWithTools))} onPhotoAnalysis={photo => setCurrentReport(prev => ({...prev, photoAnalysis:photo}))} /></ReportDisclosure>
    </ReportDisclosure>

    <ReportDisclosure title="Costi, utilizzo e trattativa" description="Budget personalizzato, proposte di prezzo e checklist della visita">
      <dl className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Manutenzione annua indicativa</dt><dd className="mt-1 text-lg font-bold">{euro(reliability.futureCosts?.annualMaintenance)}</dd></div><div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Consumo combinato indicativo</dt><dd className="mt-1 text-lg font-bold">{reliability.consumption?.combined != null ? reliability.consumption.combined.toLocaleString('it-IT') : 'Non disponibile'} {reliability.consumption?.combined != null ? reliability.consumption.fuelType || 'L/100 km' : ''}</dd></div></dl>
      <ReportDeepAnalysis key={`${reportRevision}-${currentReport.vehicle.make}-${currentReport.vehicle.model}-${currentReport.vehicle.year}-${currentReport.price.inputKm}`} report={currentReport} onUpdateReport={setCurrentReport} />
      <ReportDisclosure title="Svalutazione nel tempo" description="Simula il valore futuro e confronta le ipotesi"><DepreciationChart report={currentReport} onRateChange={rate => setCurrentReport(prev => ({ ...prev, userTools: { ...(prev as ReportWithTools).userTools, depreciationRate: rate } } as ReportWithTools))} /></ReportDisclosure>
    </ReportDisclosure>

    <ReportDisclosure title="Dati dell’auto e personalizzazione" description="Controlla la scheda tecnica e correggi anno, chilometri o prezzo">
      <ReportQuickCustomizer key={`${reportRevision}-${currentReport.vehicle.make}-${currentReport.vehicle.model}-${currentReport.vehicle.year}-${currentReport.price.inputKm}`} report={currentReport} onUpdate={updated => {setCurrentReport(updated);setReportRevision(value => value + 1);setNeedsRefresh(false);}} />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">{specs.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold">{value}</dd></div>)}</dl>
    </ReportDisclosure>

    <ReportDisclosure title="Alternative e strumenti utili" description="Altre auto, verifiche ufficiali, officine e profilo digitale">
      {!!currentReport.alternatives?.length && <div><h3 className="mb-3 text-sm font-bold">Alternative da confrontare</h3><div className="grid gap-3 sm:grid-cols-2">{currentReport.alternatives.map(alt => <a key={`${alt.make}-${alt.model}`} href={`/valutazione/${slugify(alt.make)}/${slugify(alt.model)}`} className="rounded-xl border border-slate-200 p-3 text-sm hover:border-blue-400"><span className="block font-bold">{alt.make} {alt.model}</span><span className="mt-1 block text-slate-500">Stima: {euro(alt.estimatedValue)}</span></a>)}</div></div>}
      <VehicleHistoryHelp report={currentReport} onUpdate={setCurrentReport} />
      <div><h3 className="mb-3 text-sm font-bold">Verifiche ufficiali</h3><div className="flex flex-col gap-3">{[['Revisioni e chilometri registrati', 'https://www.ilportaledellautomobilista.it/interrogazionistoricorevisioni/spa/'], ['Campagne di richiamo UNRAE', 'https://richiami.unraeservizi.com/'], ['Estratto cronologico PRA', 'https://www.aci.it/servizi/lestratto-cronologico-pra/']].map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">{label}<ExternalLink className="h-3 w-3 shrink-0" /></a>)}</div></div>
      <ReportDisclosure title="Trova un’officina" description="Servizi vicini e informazioni sulle riparazioni"><NearbyServicesLocator key={reportRevision} make={vehicle.make} model={vehicle.model} damage={photoAnalysis?.damage} repairRange={photoAnalysis?.repairRange} location={vehicle.location ? { cap: vehicle.location.cap, city: vehicle.location.city, province: vehicle.location.province, regionName: vehicle.location.region || 'Lombardia', regionId: 'lombardia' } : undefined} /></ReportDisclosure>
      <ReportDisclosure title="Prepara un annuncio di vendita" description="Genera una bozza con i dati di questa auto"><SellAdGenerator key={reportRevision} report={currentReport} /></ReportDisclosure>
      <div className="rounded-xl bg-blue-50 p-4"><h3 className="text-sm font-bold">Profilo digitale dell’auto</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">Organizza tagliandi, scadenze e documenti in un profilo dedicato.</p><button onClick={createPassport} disabled={isCreatingPassport} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white disabled:opacity-50">{isCreatingPassport && <Loader2 className="h-4 w-4 animate-spin" />}Crea profilo digitale</button>{passportError && <p role="alert" className="mt-2 text-sm text-red-700">{passportError}</p>}</div>
    </ReportDisclosure>

    <div className="pt-4"><ReportPdfExport report={currentReport} /></div>
    <ShareButton title={`Valutazione ${vehicle.make} ${vehicle.model}`} text={`Guarda il report di questa ${vehicle.make} ${vehicle.model} su AutoEsperto.`} />
    <p className="pt-2 text-center text-xs leading-relaxed text-slate-500">Stime indicative sui dati disponibili. Controlla documenti e condizioni reali con un professionista prima dell’acquisto.</p>
  </div>;
}
