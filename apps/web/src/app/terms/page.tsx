import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Termini di Servizio',
  description: 'Termini e condizioni di utilizzo del servizio AutoEsperto.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Termini di Servizio"
      updated="31 luglio 2026"
      intro="I presenti Termini di Servizio disciplinano l'utilizzo del sito e del servizio AutoEsperto. Utilizzando il servizio l'utente accetta integralmente i presenti termini."
      sections={[
        {
          heading: 'Oggetto del servizio',
          paragraphs: [
            'AutoEsperto è un servizio gratuito che fornisce valutazioni indicative su autoveicoli usati, basate sulla targa (dati veicolari ufficiali) o su marca e modello, sul chilometraggio e sul prezzo richiesto inseriti dall\'utente.',
            'Il report generato comprende informazioni veicolari, una valutazione indicativa di affidabilità, una stima di mercato e consigli generali prima dell\'acquisto.',
          ],
        },
        {
          heading: 'Natura delle valutazioni',
          paragraphs: [
            'Tutte le valutazioni, le stime e i consigli forniti da AutoEsperto hanno carattere puramente indicativo e informativo. Non costituiscono consulenza professionale, perizia tecnica, certificazione di affidabilità né garanzia sullo stato del veicolo.',
            'Le stime di mercato sono calcolate con modelli statistici su marca, modello, anno e chilometraggio e possono differire dal valore reale di vendita.',
            'AutoEsperto non effettua ispezioni fisiche del veicolo: prima dell\'acquisto si raccomanda sempre una verifica indipendente da parte di un professionista.',
          ],
        },
        {
          heading: 'Uso corretto del servizio',
          paragraphs: [
            'L\'utente si impegna a utilizzare il servizio solo per finalità lecite e a non effettuare richieste automatizzate o in volume che possano compromettere la disponibilità del servizio.',
            'L\'utente dichiara di avere titolo per richiedere informazioni relative al veicolo oggetto di analisi.',
          ],
        },
        {
          heading: 'Disponibilità del servizio',
          paragraphs: [
            'Il servizio è fornito "così com\'è" e può essere sospeso o modificato in qualsiasi momento senza preavviso. AutoEsperto non garantisce la continuità, la correttezza o la completezza dei dati restituiti dai fornitori esterni.',
          ],
        },
        {
          heading: 'Proprietà intellettuale',
          paragraphs: [
            'Marchio, logo, testi e struttura del sito appartengono al Titolare. È vietata la riproduzione non autorizzata dei contenuti, salvo uso personale e non commerciale.',
          ],
        },
        {
          heading: 'Limitazione di responsabilità',
          paragraphs: [
            'Nel limite massimo consentito dalla legge, il Titolare non risponde di danni diretti o indiretti derivanti dall\'affidamento riposto nelle valutazioni fornite dal servizio o dall\'impossibilità di utilizzarlo.',
          ],
        },
        {
          heading: 'Legge applicabile e foro',
          paragraphs: [
            'I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il foro di residenza o domicilio del consumatore, ai sensi di legge.',
          ],
        },
      ]}
    />
  );
}
