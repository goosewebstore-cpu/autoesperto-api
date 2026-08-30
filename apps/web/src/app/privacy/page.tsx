import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali nel servizio AutoEsperto.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="25 agosto 2026"
      intro="Questa informativa descrive come AutoEsperto tratta i dati personali raccolti attraverso il sito web e i servizi digitali, nel rispetto del Regolamento Generale sulla Protezione dei Dati (GDPR - Reg. UE 2016/679) e del D.Lgs. 196/2003 e successive modifiche."
      sections={[
        {
          heading: 'Titolare del Trattamento e Contatti',
          paragraphs: [
            'Il Titolare del trattamento è Ralfh (Sviluppatore Freelance e gestore della piattaforma AutoEsperto.it), con sede a Siracusa (SR), Italia.',
            'Per qualsiasi richiesta di chiarimento, esercizio dei diritti degli interessati o comunicazioni relative alla protezione dei dati personali, è possibile contattare l’indirizzo: privacy@autoesperto.it oppure supporto@autoesperto.it.',
          ],
        },
        {
          heading: 'Dati dell’account e Registrazione',
          paragraphs: [
            'Per creare l’area personale e salvare le analisi dei veicoli trattiamo: nome, indirizzo email oppure numero di telefono, password crittografata, data di registrazione e log tecnici di autenticazione. La password non viene mai memorizzata in chiaro nei nostri database.',
            'L’utente può scegliere liberamente email o telefono come identificativo di accesso. Non utilizziamo tali recapiti per comunicazioni promozionali o di marketing senza un consenso specifico e separato.',
          ],
        },
        {
          heading: 'Pagamenti e Transazioni',
          paragraphs: [
            'I pagamenti per le analisi avanzate sono gestiti in modo sicuro tramite il fornitore certificato PCI-DSS Stripe. AutoEsperto memorizza unicamente l’identificativo della transazione, lo stato del pagamento, l’importo e la data contabile. I dati completi delle carte di credito/debito non transitano e non vengono conservati sui server di AutoEsperto.',
          ],
        },
        {
          heading: 'Foto e Report di Analisi del Veicolo',
          paragraphs: [
            'Le fotografie caricate per l’analisi visiva vengono elaborate tramite protocolli crittografati dai sistemi di intelligenza artificiale per l’identificazione del modello e la stima dello stato d’uso. AutoEsperto non conserva permanentemente i file immagine grezzi sui server di produzione oltre il tempo strettamente necessario all’elaborazione.',
            'Nel database persistiamo unicamente i metadati strutturati: veicolo identificato, range di prezzo di mercato, score di affidabilità e checklist pre-acquisto associata all’account.',
            'Eventuali volti o targhe visibili nelle fotografie non vengono indicizzati né utilizzati per finalità di profilazione individuale.',
          ],
        },
        {
          heading: 'Finalità del Trattamento e Basi Giuridiche',
          paragraphs: [
            'Trattiamo i dati personali per: (a) consentire l’accesso e la fruizione dei servizi della piattaforma (esecuzione contrattuale ex art. 6.1.b GDPR); (b) adempiere agli obblighi di legge e fiscali (art. 6.1.c GDPR); (c) prevenire frodi informatiche e garantire la sicurezza dell’infrastruttura (legittimo interesse ex art. 6.1.f GDPR).',
            'Per l’attivazione di cookie analitici e pubblicitari (Google AdSense / Analytics), la base giuridica è esclusivamente il consenso libero, informato ed esplicito dell’utente (art. 6.1.a GDPR), revocabile in qualsiasi momento.',
          ],
        },
        {
          heading: 'Destinatari dei Dati e Terze Parti',
          paragraphs: [
            'I dati possono essere trattati da fornitori tecnici nominati Responsabili del Trattamento ai sensi dell’art. 28 GDPR: provider di hosting cloud ad alta affidabilità (Vercel / Cloudflare), gateway di pagamento Stripe, e Google per i servizi pubblicitari e statistici (qualora attivati con consenso).',
            'I dati degli utenti e i report generati non vengono ceduti né venduti a terzi per scopi di telemarketing o profilazione esterna.',
          ],
        },
        {
          heading: 'Periodo di Conservazione dei Dati',
          paragraphs: [
            'I dati dell’account e lo storico dei report rimangono archiviati per tutta la durata di attività dell’account, fino a richiesta esplicita di cancellazione da parte dell’utente, fatti salvi i tempi di conservazione obbligatori per legge a fini contabili o fiscali.',
          ],
        },
        {
          heading: 'Diritti dell’Interessato (Artt. 15-22 GDPR)',
          paragraphs: [
            'L’utente ha il diritto di accedere ai propri dati personali, chiederne la rettifica, la cancellazione (diritto all’oblio), la limitazione del trattamento o la portabilità, nonché di opporsi al trattamento in qualsiasi momento, inviando una comunicazione scritta a: privacy@autoesperto.it.',
            'È inoltre sempre possibile proporre reclamo all’Autorità Garante per la Protezione dei Dati Personali (Piazza Venezia 11, 00187 Roma - www.garanteprivacy.it).',
          ],
        },
      ]}
    />
  );
}
