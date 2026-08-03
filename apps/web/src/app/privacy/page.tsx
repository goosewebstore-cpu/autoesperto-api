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
      updated="2 agosto 2026"
      intro="Questa informativa descrive come AutoEsperto tratta i dati necessari per creare l’account, gestire il pagamento e conservare il report acquistato, nel rispetto del GDPR e della normativa italiana applicabile."
      sections={[
        {
          heading: 'Titolare e contatti',
          paragraphs: [
            'Il Titolare del trattamento è il gestore del servizio AutoEsperto. Le informazioni identificative complete del venditore devono essere rese disponibili prima dell’attivazione dei pagamenti reali. Per richieste privacy: goosewebstore@gmail.com.',
          ],
        },
        {
          heading: 'Dati dell’account',
          paragraphs: [
            'Per creare l’area personale trattiamo nome, email oppure numero di telefono, password in forma crittografata, data di registrazione e informazioni tecniche di sicurezza. La password originale non è leggibile né conservata in chiaro.',
            'L’utente può scegliere email o telefono come identificativo. Non utilizziamo questi dati per marketing senza un consenso separato.',
          ],
        },
        {
          heading: 'Pagamento',
          paragraphs: [
            'Il pagamento è gestito da Stripe. AutoEsperto conserva l’identificativo della sessione, lo stato, l’importo e la data del pagamento per riconciliare l’acquisto. I dati completi della carta non transitano nei sistemi AutoEsperto e non vengono conservati da AutoEsperto.',
          ],
        },
        {
          heading: 'Foto e report dell’auto',
          paragraphs: [
            'La fotografia caricata viene inviata al provider di analisi visiva esclusivamente per eseguire la richiesta. AutoEsperto non salva la fotografia originale nel database.',
            'Nel database salviamo il risultato strutturato: veicolo riconosciuto, osservazioni visive, stime indicative e report specifico per marca, modello e anno disponibili. Il report è associato all’account per renderlo nuovamente consultabile.',
            'Targhe, persone e altri dati personali eventualmente visibili nella foto devono essere ignorati dal sistema di analisi e non vengono intenzionalmente trascritti nel report.',
          ],
        },
        {
          heading: 'Finalità e basi giuridiche',
          paragraphs: [
            'Trattiamo i dati per creare e proteggere l’account, eseguire il contratto, confermare il pagamento, generare e conservare l’analisi richiesta e fornire assistenza. Le basi giuridiche sono l’esecuzione del contratto, gli obblighi di legge e il legittimo interesse alla sicurezza del servizio.',
            'Per cookie pubblicitari e tecnologie non necessarie la base è il consenso, revocabile in qualsiasi momento senza perdere le funzioni essenziali.',
          ],
        },
        {
          heading: 'Fornitori e destinatari',
          paragraphs: [
            'I dati possono essere trattati dai fornitori strettamente necessari: hosting del sito e dell’API, database, Stripe per il pagamento, provider di intelligenza artificiale per l’analisi e Google solo quando AdSense viene effettivamente attivato sulle pagine pubbliche.',
            'I dati dell’account, le fotografie e i report non vengono venduti a inserzionisti, concessionari, officine o partner commerciali. Le collaborazioni commerciali acquistano visibilità o servizi, non accesso ai dati personali degli utenti.',
          ],
        },
        {
          heading: 'Conservazione e cancellazione',
          paragraphs: [
            'Account e report restano conservati per rendere disponibile il servizio acquistato, finché l’account è attivo o fino a una richiesta di cancellazione, salvo dati che devono essere conservati più a lungo per obblighi fiscali, contabili, antifrode o di difesa legale.',
            'La foto originale non viene archiviata. Log tecnici e dati di sicurezza sono conservati per periodi limitati e proporzionati alla finalità.',
          ],
        },
        {
          heading: 'Diritti',
          paragraphs: [
            'L’interessato può chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione nei casi previsti dagli artt. 15-22 GDPR scrivendo a goosewebstore@gmail.com.',
            'È possibile proporre reclamo al Garante per la protezione dei dati personali tramite garanteprivacy.it.',
          ],
        },
      ]}
    />
  );
}
