import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Contatti e Assistenza | AutoEsperto',
  description: 'Contatta il team di AutoEsperto per assistenza tecnica, rettifiche dati, relazioni con la stampa e partnership con officine e periti.',
  alternates: { canonical: '/contatti' },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contatti & Assistenza"
      updated="25 agosto 2026"
      intro="Siamo a disposizione per assistenza su valutazioni e Passaporto Digitale, segnalazioni tecniche, relazioni con i media e collaborazioni professionali."
      sections={[
        {
          heading: 'Supporto Utenti & Segnalazioni Dati',
          paragraphs: [
            'Per domande sul funzionamento del servizio, segnalazioni di annunci non conformi o suggerimenti metodologici: scrivi a supporto@autoesperto.it.',
            'Il nostro team di supporto risponde dal lunedì al venerdì (09:00 - 18:00) entro 24-48 ore lavorative.',
          ],
        },
        {
          heading: 'Ufficio Stampa & Relazioni con i Media',
          paragraphs: [
            'Per richieste di interviste, dati statistici sull\'andamento delle quotazioni dell\'usato in Italia, report sulla svalutazione delle auto elettriche o approfondimenti sul Regolamento UE 2026/1738 (Passaporto Digitale del Veicolo): stampa@autoesperto.it.',
          ],
        },
        {
          heading: 'Partnership con Officine, Gommisti e Periti Indipendenti',
          paragraphs: [
            'Sei un\'officina meccatronica, un centro revisioni MCTC o un perito assicurativo e desideri integrare i controlli certificati di AutoEsperto o figurare nella rete di ispezione indipendente pre-acquisto? Scrivi a partner@autoesperto.it.',
          ],
        },
        {
          heading: 'Dati Societari & Comunicazioni Legali / PEC',
          paragraphs: [
            'Ragione sociale: AutoEsperto Digital S.r.l.',
            'Sede legale: Milano (MI), Italia',
            'Posta Elettronica Certificata (PEC): autoesperto@pec.it',
            'Responsabile della protezione dei dati (DPO / Privacy): privacy@autoesperto.it',
          ],
        },
      ]}
    />
  );
}
