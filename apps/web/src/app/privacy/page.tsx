import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="31 luglio 2026"
      intro="La presente informativa descrive le modalità di trattamento dei dati personali degli utenti del sito AutoEsperto, nel rispetto del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 e successive modificazioni."
      sections={[
        {
          heading: 'Titolare del trattamento',
          paragraphs: [
            'Il Titolare del trattamento è il gestore del servizio AutoEsperto. Per qualsiasi richiesta in materia di privacy è possibile scrivere a: privacy@autoesperto.it.',
          ],
        },
        {
          heading: 'Dati trattati',
          paragraphs: [
            'Il servizio non richiede la creazione di un account né la fornitura di dati personali identificativi (nome, cognome, email, telefono).',
            'Per effettuare un\'analisi l\'utente inserisce volontariamente: targa del veicolo oppure marca e modello, chilometraggio e prezzo richiesto. Tali dati riguardano un veicolo e vengono utilizzati esclusivamente per generare il report richiesto.',
            'Nel caso in cui la targa sia collegata a dati di natura personale, il trattamento avviene nel solo interesse dell\'utente che ha richiesto l\'analisi.',
          ],
        },
        {
          heading: 'Finalità e base giuridica',
          paragraphs: [
            'I dati veicolari sono trattati con strumenti informatici e telematici per la sola esecuzione del servizio richiesto (art. 6, par. 1, lett. b GDPR). Non vengono effettuate profilazioni dell\'utente.',
            'I dati non sono venduti, ceduti o comunicati a terzi, fatta eccezione per i fornitori tecnici strettamente necessari all\'erogazione del servizio (hosting, servizi di consultazione dati veicolari, provider di intelligenza artificiale quando attivo) che agiscono in qualità di responsabili del trattamento.',
          ],
        },
        {
          heading: 'Cookie',
          paragraphs: [
            'Il sito utilizza cookie tecnici essenziali e, previo consenso, cookie di profilazione di terze parti (Google AdSense/Ad Manager). Per i dettagli consultare la Cookie Policy.',
          ],
        },
        {
          heading: 'Conservazione dei dati',
          paragraphs: [
            'Le ricerche effettuate non vengono salvate sul server: i dati veicolari sono utilizzati in tempo reale per generare il report e non vengono archiviati in forma associabile all\'utente.',
            'La cache tecnica utilizzata per ridurre le chiamate ai servizi esterni ha una durata limitata e non contiene dati personali.',
          ],
        },
        {
          heading: 'Diritti dell\'interessato',
          paragraphs: [
            'L\'utente può esercitare in qualsiasi momento i diritti previsti dagli artt. 15-22 GDPR: accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, scrivendo al Titolare.',
            'È inoltre possibile proporre reclamo all\'Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it).',
          ],
        },
        {
          heading: 'Modifiche',
          paragraphs: [
            'La presente informativa può essere soggetta ad aggiornamenti. La versione vigente è sempre consultabile in questa pagina, con indicazione della data di ultimo aggiornamento.',
          ],
        },
      ]}
    />
  );
}
