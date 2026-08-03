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
      intro="Per assistenza sull’account, sul pagamento, sul report oppure per una proposta commerciale puoi contattare il team AutoEsperto."
      sections={[
        {
          heading: 'Assistenza e segnalazioni',
          paragraphs: [
            'Per problemi con il servizio, suggerimenti o segnalazioni di inesattezze nei dati: scrivi a goosewebstore@gmail.com. Rispondiamo di norma entro 2-3 giorni lavorativi.',
          ],
        },
        {
          heading: 'Privacy',
          paragraphs: [
            'Per questioni relative al trattamento dei dati personali: goosewebstore@gmail.com.',
          ],
        },
        {
          heading: 'Pubblicità e collaborazioni',
          paragraphs: [
            'Per sponsorizzazioni, partnership con officine, periti, concessionari e altri servizi automotive: goosewebstore@gmail.com. Le proposte sono descritte anche nella pagina Lavora con noi.',
          ],
        },
      ]}
    />
  );
}
