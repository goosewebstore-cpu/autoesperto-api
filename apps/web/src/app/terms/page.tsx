import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Termini di Servizio',
  description: 'Termini del servizio a pagamento AutoEsperto.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Termini di Servizio"
      updated="2 agosto 2026"
      intro="I presenti Termini disciplinano l’account, l’acquisto singolo e l’analisi AutoEsperto. Prima di attivare pagamenti reali devono essere pubblicati i dati identificativi, geografici e fiscali completi del venditore."
      sections={[
        {
          heading: 'Servizio acquistato',
          paragraphs: [
            'L’acquisto include una sola analisi completa per account, senza rinnovo automatico. Il prezzo mostrato prima del pagamento è riferito a tale singola analisi.',
            'Il report include riconoscimento visivo quando possibile, prezzo indicativo, osservazioni esterne visibili e approfondimenti relativi al modello e all’anno riconosciuti o dichiarati.',
          ],
        },
        {
          heading: 'Account e disponibilità del report',
          paragraphs: [
            'L’utente è responsabile della correttezza dell’email o del telefono utilizzati e della riservatezza della password. Ogni account può generare una sola analisi; dopo la generazione il report resta consultabile nell’area personale finché il servizio e l’account restano attivi.',
            'Non è consentito creare account multipli per aggirare limiti tecnici, promozioni o misure antifrode.',
          ],
        },
        {
          heading: 'Pagamento',
          paragraphs: [
            'Il pagamento è una tantum ed è elaborato da Stripe. AutoEsperto non conserva i dati completi della carta. L’analisi diventa disponibile solo dopo la conferma del pagamento.',
            'Un pagamento riuscito non consuma automaticamente l’analisi: il credito viene utilizzato soltanto quando il report viene generato e salvato.',
          ],
        },
        {
          heading: 'Recesso ed esecuzione immediata',
          paragraphs: [
            'Prima della generazione del report si applicano i diritti riconosciuti al consumatore dalla legge, incluso il diritto di recesso quando previsto. Per iniziare l’analisi durante il relativo periodo, l’utente deve chiedere espressamente l’esecuzione immediata.',
            'Quando il servizio digitale è stato interamente eseguito con il previo consenso espresso dell’utente e con la sua accettazione della perdita del diritto di recesso, il recesso può non essere più esercitabile nei limiti previsti dal Codice del Consumo. Restano fermi i diritti in caso di servizio non conforme o non erogato.',
          ],
        },
        {
          heading: 'Natura delle valutazioni',
          paragraphs: [
            'Le valutazioni sono indicative e informative. Non costituiscono perizia, certificazione, diagnosi meccanica, verifica della storia del veicolo né garanzia sul suo stato o sul prezzo realizzabile.',
            'Una foto non consente di rilevare danni nascosti, struttura, motore, sicurezza, chilometri reali o incidenti pregressi. Prima di acquistare o riparare un veicolo è necessario rivolgersi a un professionista indipendente.',
          ],
        },
        {
          heading: 'Errori e assistenza',
          paragraphs: [
            'Se la foto non consente di riconoscere il veicolo, il credito non viene utilizzato e l’utente può riprovare. Se il pagamento è riuscito ma il servizio non viene erogato per un problema tecnico, l’utente può chiedere assistenza o rimborso a goosewebstore@gmail.com.',
          ],
        },
        {
          heading: 'Pubblicità e partnership',
          paragraphs: [
            'Le pagine pubbliche possono contenere annunci o contenuti sponsorizzati chiaramente identificati. Gli inserzionisti non possono influenzare il verdetto di un report acquistato e non ricevono i dati personali o il contenuto delle analisi.',
          ],
        },
        {
          heading: 'Legge applicabile',
          paragraphs: [
            'I Termini sono regolati dalla legge italiana. Per il consumatore resta competente il foro del luogo di residenza o domicilio nei casi previsti dalla legge.',
          ],
        },
      ]}
    />
  );
}
