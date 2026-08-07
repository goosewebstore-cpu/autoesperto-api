import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'DMCA — Segnalazione violazione copyright',
  description:
    "Procedura DMCA per segnalare contenuti che violano il diritto d'autore su AutoEsperto.",
  alternates: { canonical: '/dmca' },
};

export default function DmcaPage() {
  return (
    <LegalPage
      title="DMCA — Policy sul Copyright"
      updated="7 agosto 2026"
      intro="AutoEsperto rispetta la proprietà intellettuale altrui e si attende lo stesso dai propri utenti. In conformità al Digital Millennium Copyright Act (DMCA) e alla normativa europea e italiana sul diritto d'autore, rispondiamo tempestivamente alle segnalazioni di presunta violazione."
      sections={[
        {
          heading: '1. Segnalazione di violazione (Takedown Notice)',
          paragraphs: [
            "Se ritieni che un contenuto presente su AutoEsperto violi il tuo diritto d'autore, puoi inviare una segnalazione scritta a goosewebstore@gmail.com contenente le informazioni elencate di seguito.",
            "La segnalazione deve includere: (a) identificazione dell'opera protetta che si ritiene violata; (b) identificazione del contenuto contestato e informazioni sufficienti per localizzarlo sul servizio (ad esempio URL o screenshot); (c) i tuoi dati di contatto, comprensivi di nome, indirizzo, email e numero di telefono; (d) una dichiarazione in buona fede che l'uso del materiale non è autorizzato dal titolare del diritto d'autore, dal suo agente o dalla legge; (e) una dichiarazione, sotto pena di falsa testimonianza, che le informazioni fornite sono accurate e che sei il titolare del diritto o sei autorizzato ad agire per suo conto; (f) la tua firma fisica o elettronica.",
          ],
        },
        {
          heading: '2. Agente designato',
          paragraphs: [
            "Le notifiche DMCA devono essere inviate al seguente contatto: goosewebstore@gmail.com. L'agente designato esaminerà la segnalazione e, se conforme ai requisiti, provvederà alla rimozione o alla disabilitazione dell'accesso al contenuto contestato in tempi ragionevoli.",
          ],
        },
        {
          heading: '3. Contro-notifica (Counter-Notice)',
          paragraphs: [
            "Se ritieni che il tuo contenuto sia stato rimosso per errore o errata identificazione, puoi inviare una contro-notifica a goosewebstore@gmail.com contenente: (a) la tua firma fisica o elettronica; (b) identificazione del contenuto rimosso e la posizione in cui appariva prima della rimozione; (c) una dichiarazione, sotto pena di falsa testimonianza, che ritieni in buona fede che il contenuto sia stato rimosso per errore; (d) il tuo nome, indirizzo e numero di telefono e il consenso alla giurisdizione del tribunale competente.",
            "Dopo aver ricevuto una contro-notifica valida, AutoEsperto ne trasmetterà copia al segnalante originario. Se il segnalante non intraprende un'azione legale entro dieci (10) giorni lavorativi, il contenuto potrà essere ripristinato.",
          ],
        },
        {
          heading: '4. Politica per le violazioni ripetute',
          paragraphs: [
            "AutoEsperto si riserva il diritto di chiudere l'account degli utenti che risultino responsabili di violazioni ripetute del diritto d'autore. La decisione viene assunta caso per caso, tenendo conto della gravità e della frequenza delle violazioni.",
          ],
        },
        {
          heading: '5. Limitazione di responsabilità',
          paragraphs: [
            "AutoEsperto agisce in buona fede nel gestire le segnalazioni DMCA e non si assume responsabilità per la rimozione di contenuti in conformità a una notifica conforme ai requisiti di legge.",
            "Segnalazioni false o in malafede possono comportare responsabilità legale per il segnalante. Si consiglia di consultare un legale prima di inviare una segnalazione se non si è certi che il contenuto violi i propri diritti.",
          ],
        },
        {
          heading: '6. Normativa europea e italiana',
          paragraphs: [
            "Oltre al DMCA, AutoEsperto si attiene alla Direttiva UE 2019/790 sul diritto d'autore nel mercato unico digitale e alla legge italiana sul diritto d'autore (Legge 633/1941 e successive modifiche). I titolari di diritti nell'Unione Europea possono avvalersi delle medesime procedure di segnalazione descritte sopra.",
          ],
        },
        {
          heading: '7. Contatti',
          paragraphs: [
            'Per qualsiasi domanda relativa a questa policy o per inviare una segnalazione, scrivi a goosewebstore@gmail.com.',
          ],
        },
      ]}
    />
  );
}
