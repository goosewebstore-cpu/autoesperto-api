import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie, strumenti tecnici, preferenze e pubblicità su AutoEsperto.',
  alternates: { canonical: '/cookie-policy' },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="25 agosto 2026"
      intro="AutoEsperto rispetta la tua privacy e garantisce il controllo completo sui cookie e sulle tecnologie di tracciamento, in conformità alle Linee Guida del Garante Privacy del 10 giugno 2021 e al GDPR."
      sections={[
        {
          heading: 'Cookie Tecnici Necessari',
          paragraphs: [
            'Il sito utilizza cookie tecnici e memoria locale (localStorage) strettamente necessari per il funzionamento della piattaforma: gestione della sessione di autenticazione, sicurezza informatica e memorizzazione delle tue preferenze di consenso.',
            'Questi strumenti sono sempre attivi e non richiedono il tuo consenso preventivo in quanto indispensabili per erogare i servizi richiesti.',
          ],
        },
        {
          heading: 'Cookie Analitici e Prestazionali',
          paragraphs: [
            'Utilizziamo strumenti di misurazione statistica aggregata e anonimizzata per comprendere l’utilizzo del sito e migliorare costantemente l’esperienza utente. Nessun dato identificativo o contenuto riservato dei report viene trasferito a sistemi terzi non autorizzati.',
          ],
        },
        {
          heading: 'Google AdSense e Pubblicità Programmata',
          paragraphs: [
            'Sulle pagine informative e sulle guide pubbliche di AutoEsperto possono essere ospitati annunci pubblicitari erogati tramite la rete Google AdSense.',
            'Google e i suoi partner pubblicitari utilizzano cookie e identificatori pubblicitari per mostrare annunci pertinenti, prevenire frodi pubblicitarie e misurare il rendimento delle campagne.',
            'Grazie all’integrazione di Google Consent Mode v2, i cookie di profilazione pubblicitaria restano disabilitati di default e vengono attivati solo in seguito a un tuo esplicito consenso nella categoria “Marketing”.',
          ],
        },
        {
          heading: 'Gestione e Revoca del Consenso',
          paragraphs: [
            'Al primo accesso al sito puoi accettare tutti i cookie, rifiutare quelli facoltativi oppure selezionare in dettaglio le tue preferenze.',
            'Puoi modificare o revocare la tua scelta in qualsiasi momento cliccando sul pulsante circolare “Cookie” presente in basso a sinistra su ogni pagina del sito. La revoca non pregiudica la liceità dei trattamenti effettuati prima del ritiro del consenso.',
          ],
        },
        {
          heading: 'Contatti per la Privacy',
          paragraphs: ['Per domande o chiarimenti relativi all’uso dei cookie su AutoEsperto: privacy@autoesperto.it.'],
        },
      ]}
    />
  );
}
