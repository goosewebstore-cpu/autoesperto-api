import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contatta AutoEsperto per assistenza, segnalazioni e collaborazioni.',
  alternates: { canonical: '/contatti' },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contatti"
      updated="2 agosto 2026"
      intro="Per assistenza su account, pagamento o report, o per proposte commerciali, contatta il team AutoEsperto."
      sections={[
        {
          heading: 'Chi Siamo',
          paragraphs: [
            'AutoEsperto valuta auto usate in modo gratuito: prezzo di mercato, affidabilità e costi di riparazione calcolati su annunci reali.',
          ],
        },
        {
          heading: 'Assistenza e segnalazioni',
          paragraphs: [
            'Per problemi con il servizio, suggerimenti o segnalazioni di inesattezze nei dati: scrivi a supporto@autoesperto.it. Rispondiamo di norma entro 2-3 giorni lavorativi.',
          ],
        },
        {
          heading: 'Privacy',
          paragraphs: [
            'Per questioni relative al trattamento dei dati personali: supporto@autoesperto.it.',
          ],
        },
        {
          heading: 'Pubblicità e collaborazioni',
          paragraphs: [
            'Per sponsorizzazioni, partnership con officine, periti, concessionari e altri servizi automotive: supporto@autoesperto.it. Le proposte sono descritte anche nella pagina Lavora con noi.',
          ],
        },
      ]}
    />
  );
}
