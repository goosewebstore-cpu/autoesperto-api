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
      updated="25 agosto 2026"
      intro="I presenti Termini di Servizio disciplinano l’accesso, la creazione dell’account e l’utilizzo della piattaforma web e degli strumenti di valutazione AutoEsperto."
      sections={[
        {
          heading: 'Servizio acquistato e Funzionalità',
          paragraphs: [
            'L’acquisto di report avanzati o funzionalità premium include l’elaborazione completa per singolo veicolo, senza tacito rinnovo automatico. Il prezzo visualizzato prima del pagamento è chiaro, trasparente e omnicomprensivo.',
            'Il report include l’identificazione del veicolo, il valore stimato di mercato calcolato su annunci reali, osservazioni esterne e approfondimenti specifici per marca, modello, allestimento e anno.',
          ],
        },
        {
          heading: 'Account e disponibilità del report',
          paragraphs: [
            'L’utente è responsabile della correttezza dell’email o del telefono utilizzati e della riservatezza della password. Dopo la generazione, il report resta consultabile nell’area personale finché l’account rimane attivo.',
            'Non è consentito creare account fittizi o multipli per aggirare limiti tecnici, promozioni o misure di sicurezza.',
          ],
        },
        {
          heading: 'Pagamento e Sicurezza',
          paragraphs: [
            'I pagamenti sono gestiti tramite protocollo crittografato dal circuito Stripe. AutoEsperto non memorizza i dati completi delle carte di credito.',
            'Il report viene reso disponibile istantaneamente dopo la conferma positiva della transazione bancaria.',
          ],
        },
        {
          heading: 'Recesso ed esecuzione immediata',
          paragraphs: [
            'Prima della generazione del report si applicano i diritti riconosciuti al consumatore dal Codice del Consumo (D.Lgs. 206/2005).',
            'Trattandosi di fornitura di contenuto digitale mediante supporto non materiale, l’utente acconsente espressamente all’inizio dell’esecuzione durante il termine di recesso, riconoscendo che tale esecuzione comporta la perdita del diritto di recesso una volta completata la generazione del report.',
          ],
        },
        {
          heading: 'Natura delle valutazioni',
          paragraphs: [
            'Le valutazioni fornite da AutoEsperto sono elaborate con finalità informativa e orientativa sui valori medi di mercato. Non costituiscono una perizia asseverata o una diagnosi meccanica in officina.',
            'Raccomandiamo sempre di far ispezionare il veicolo sul ponte sollevatore da un meccanico di fiducia prima della conclusione formale della compravendita.',
          ],
        },
        {
          heading: 'Assistenza e Reclami',
          paragraphs: [
            'Per assistenza tecnica, problemi di accesso al report generato o richieste di fatturazione, il nostro supporto è attivo all’indirizzo: supporto@autoesperto.it.',
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
