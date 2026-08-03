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
      updated="2 agosto 2026"
      intro="AutoEsperto separa gli strumenti necessari al servizio da quelli pubblicitari. Le funzioni essenziali restano disponibili anche rifiutando i cookie non necessari."
      sections={[
        {
          heading: 'Strumenti necessari',
          paragraphs: [
            'Il sito usa memoria locale o tecnologie equivalenti per mantenere la sessione dell’account e ricordare la scelta sui cookie. Sono strumenti necessari per autenticazione, sicurezza e preferenze e non vengono usati per pubblicità comportamentale.',
          ],
        },
        {
          heading: 'Statistiche',
          paragraphs: [
            'Vercel Web Analytics può raccogliere dati tecnici aggregati sulle pagine visitate e sul dispositivo. Non inviamo ad Analytics fotografie, credenziali, dati di pagamento o contenuto dei report.',
          ],
        },
        {
          heading: 'Google AdSense',
          paragraphs: [
            'Gli annunci AdSense sono predisposti ma restano tecnicamente disattivati finché non sono configurati un account approvato, identificativi reali delle unità pubblicitarie e una piattaforma di gestione del consenso certificata da Google per SEE, Regno Unito e Svizzera.',
            'Quando attivo e autorizzato, Google e i suoi partner possono usare cookie o identificatori per erogare, misurare e, se consentito, personalizzare gli annunci. AdSense viene previsto soltanto sulle pagine pubbliche, non nell’area personale o nel report acquistato.',
          ],
        },
        {
          heading: 'Scelta e revoca',
          paragraphs: [
            'Al primo accesso è possibile accettare oppure rifiutare gli strumenti non necessari. Chiudere il banner mantiene l’impostazione “solo necessari”.',
            'La scelta può essere modificata in ogni momento tramite il pulsante “Cookie” visibile nel sito. La revoca non pregiudica la liceità dei trattamenti già effettuati e non impedisce l’uso delle funzioni essenziali.',
          ],
        },
        {
          heading: 'Terze parti',
          paragraphs: [
            'Le informazioni aggiornate sulle tecnologie pubblicitarie di Google sono disponibili nelle Norme sulla privacy e nelle Impostazioni annunci di Google. La CMP attivata sul sito mostrerà l’elenco aggiornato dei fornitori e delle finalità selezionabili.',
          ],
        },
        {
          heading: 'Contatti',
          paragraphs: ['Per richieste relative a cookie e privacy: goosewebstore@gmail.com.'],
        },
      ]}
    />
  );
}
