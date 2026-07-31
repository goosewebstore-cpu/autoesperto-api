import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Contatti',
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contatti"
      updated="31 luglio 2026"
      intro="AutoEsperto è un servizio gratuito di analisi di veicoli usati. Per segnalazioni, domande o richieste di collaborazione puoi contattarci."
      sections={[
        {
          heading: 'Assistenza e segnalazioni',
          paragraphs: [
            'Per problemi con il servizio, suggerimenti o segnalazioni di inesattezze nei dati: scrivi a supporto@autoesperto.it. Rispondiamo di norma entro 2-3 giorni lavorativi.',
          ],
        },
        {
          heading: 'Privacy',
          paragraphs: [
            'Per questioni relative al trattamento dei dati personali: privacy@autoesperto.it.',
          ],
        },
        {
          heading: 'Pubblicità e collaborazioni',
          paragraphs: [
            'AutoEsperto è sostenuto esclusivamente dalla pubblicità. Per proposte di partnership: business@autoesperto.it.',
          ],
        },
      ]}
    />
  );
}
