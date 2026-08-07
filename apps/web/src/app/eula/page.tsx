import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Contratto di Licenza (EULA)',
  description:
    "Contratto di Licenza d'Uso per l'applicazione web AutoEsperto. Condizioni di utilizzo del software, limitazioni e diritti dell'utente.",
  alternates: { canonical: '/eula' },
};

export default function EulaPage() {
  return (
    <LegalPage
      title="Contratto di Licenza d'Uso (EULA)"
      updated="7 agosto 2026"
      intro="Il presente Contratto di Licenza per l'Utente Finale (EULA) regola l'utilizzo dell'applicazione web AutoEsperto. Accedendo al servizio o utilizzandolo, l'utente accetta integralmente le condizioni qui descritte. Se non si accettano i termini, è necessario interrompere immediatamente l'uso del servizio."
      sections={[
        {
          heading: '1. Concessione della licenza',
          paragraphs: [
            "AutoEsperto concede all'utente una licenza personale, non esclusiva, non trasferibile, revocabile e limitata per accedere e utilizzare l'applicazione web esclusivamente per uso personale e non commerciale, nel rispetto dei presenti termini.",
            "La licenza non include il diritto di sublicenziare, vendere, rivendere, copiare, modificare, distribuire, decompilare o disassemblare il software, i contenuti o i report generati, salvo quanto espressamente consentito dalla legge applicabile.",
          ],
        },
        {
          heading: '2. Proprietà intellettuale',
          paragraphs: [
            "Tutto il software, il codice sorgente, i modelli di intelligenza artificiale, i contenuti editoriali, la grafica, il design e i marchi presenti su AutoEsperto sono di proprietà esclusiva del gestore del servizio o dei rispettivi licenzianti.",
            "I report generati per l'utente sono concessi in licenza d'uso personale. L'utente non acquisisce diritti di proprietà sul software o sulla tecnologia sottostante.",
          ],
        },
        {
          heading: "3. Restrizioni d'uso",
          paragraphs: [
            "L'utente si impegna a non utilizzare AutoEsperto per scopi illeciti, fraudolenti, diffamatori o comunque contrari alla legge e all'ordine pubblico.",
            "È vietato: tentare di accedere a sistemi, account o dati non autorizzati; interferire con il funzionamento del servizio; utilizzare bot, scraper o strumenti automatizzati non autorizzati; rimuovere o alterare avvisi di copyright o di proprietà.",
            "La violazione di queste restrizioni può comportare la sospensione o la chiusura immediata dell'account, senza rimborso e senza preavviso.",
          ],
        },
        {
          heading: "4. Contenuto generato dall'utente",
          paragraphs: [
            "L'utente è l'unico responsabile delle fotografie e dei dati caricati. AutoEsperto non verifica e non garantisce l'accuratezza dei contenuti forniti dall'utente.",
            "Caricando contenuti, l'utente garantisce di avere i diritti necessari e di non violare diritti di terzi, privacy o normative vigenti.",
          ],
        },
        {
          heading: '5. Esclusione di garanzie',
          paragraphs: [
            'Il servizio è fornito "così com\'è" e "come disponibile", senza garanzie di alcun tipo, esplicite o implicite, incluse — a titolo esemplificativo — garanzie di commerciabilità, idoneità per uno scopo particolare o non violazione di diritti.',
            "AutoEsperto non garantisce che il servizio sia privo di errori, interruzioni o vulnerabilità. Le analisi e le stime fornite sono indicative e non sostituiscono una perizia professionale.",
          ],
        },
        {
          heading: '6. Limitazione di responsabilità',
          paragraphs: [
            "Nei limiti consentiti dalla legge applicabile, AutoEsperto e i suoi collaboratori non sono responsabili per danni diretti, indiretti, incidentali, speciali, consequenziali o punitivi derivanti dall'uso o dall'impossibilità di utilizzo del servizio.",
            "La responsabilità complessiva di AutoEsperto nei confronti dell'utente non può in ogni caso superare l'importo effettivamente pagato dall'utente per il servizio negli ultimi dodici mesi.",
          ],
        },
        {
          heading: '7. Aggiornamenti e modifiche',
          paragraphs: [
            "AutoEsperto si riserva il diritto di aggiornare, modificare o interrompere il servizio — in tutto o in parte — in qualsiasi momento, con o senza preavviso. Gli aggiornamenti possono includere modifiche alle funzionalità, correzioni di bug e miglioramenti della sicurezza.",
            "AutoEsperto può modificare il presente EULA in qualsiasi momento. Le modifiche significative saranno comunicate tramite il sito. L'uso continuato del servizio dopo la pubblicazione delle modifiche costituisce accettazione dei nuovi termini.",
          ],
        },
        {
          heading: '8. Risoluzione',
          paragraphs: [
            "L'utente può interrompere l'uso del servizio e richiedere la cancellazione dell'account in qualsiasi momento scrivendo a goosewebstore@gmail.com.",
            "AutoEsperto può sospendere o chiudere l'accesso dell'utente in caso di violazione del presente EULA, uso improprio del servizio o per ragioni di sicurezza, senza obbligo di rimborso per servizi già erogati.",
          ],
        },
        {
          heading: '9. Legge applicabile e foro competente',
          paragraphs: [
            'Il presente EULA è regolato dalla legge italiana. Per qualsiasi controversia derivante da o connessa al presente contratto, è competente il foro del luogo di residenza o domicilio del consumatore, nei casi previsti dalla legge.',
            'Resta fermo il diritto del consumatore di accedere a procedure di risoluzione alternativa delle controversie (ADR) e alla piattaforma ODR della Commissione Europea.',
          ],
        },
        {
          heading: '10. Contatti',
          paragraphs: [
            "Per qualsiasi domanda relativa al presente Contratto di Licenza, è possibile contattare AutoEsperto all'indirizzo goosewebstore@gmail.com.",
          ],
        },
      ]}
    />
  );
}
