import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Cookie Policy',
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="31 luglio 2026"
      intro="Questa pagina descrive le tipologie di cookie e tecnologie similari utilizzate dal sito AutoEsperto e le modalità per gestirne il consenso, in conformità al Regolamento UE 2016/679 e alla Direttiva 2009/136/CE (c.d. Cookie Law)."
      sections={[
        {
          heading: 'Cosa sono i cookie',
          paragraphs: [
            'I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell\'utente per memorizzare informazioni durante la navigazione.',
          ],
        },
        {
          heading: 'Cookie tecnici',
          paragraphs: [
            'Il sito utilizza cookie tecnici strettamente necessari al funzionamento del servizio (ad esempio per ricordare la preferenza sul consenso ai cookie). Questi cookie non richiedono il consenso dell\'utente.',
            'Il sito non utilizza cookie di prima parte di profilazione.',
          ],
        },
        {
          heading: 'Cookie di terze parti (Google AdSense)',
          paragraphs: [
            'Il sito può mostrare annunci pubblicitari tramite Google AdSense. Google e i suoi partner utilizzano cookie di profilazione per mostrare annunci basati sulle visite precedenti dell\'utente.',
            'I cookie AdSense sono di terze parti e vengono attivati solo dopo il consenso espresso dell\'utente tramite l\'apposito banner.',
            'Per ulteriori informazioni: policies.google.com/technologies/ads e adssettings.google.com (pagina di gestione degli annunci di Google).',
          ],
        },
        {
          heading: 'Gestione del consenso',
          paragraphs: [
            'Al primo accesso viene mostrato un banner che consente di accettare o rifiutare i cookie non tecnici. La scelta viene ricordata e può essere modificata in qualsiasi momento.',
            'È inoltre possibile gestire o disabilitare i cookie direttamente dal browser (Impostazioni → Privacy e sicurezza). La disabilitazione dei cookie non impedisce l\'utilizzo delle funzioni essenziali del sito.',
          ],
        },
        {
          heading: 'Contatti',
          paragraphs: [
            'Per domande relative alla presente Cookie Policy scrivere a: privacy@autoesperto.it.',
          ],
        },
      ]}
    />
  );
}
