import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Contatti e Assistenza | AutoEsperto',
  description: 'Contatta AutoEsperto per assistenza, rettifiche, collaborazioni e proposte di pubblicità per attività locali e aziende del settore auto.',
  alternates: { canonical: '/contatti' },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contatti & Assistenza"
      updated="29 ottobre 2026"
      intro="Siamo a disposizione per assistenza su valutazioni e Passaporto Digitale, segnalazioni tecniche, relazioni con i media e collaborazioni professionali."
      sections={[
        {
          heading: 'Supporto Utenti & Segnalazioni Dati',
          paragraphs: [
            'Per assistenza, richieste sul report storico del veicolo, privacy o segnalazioni: scrivi a goosewebstore@gmail.com. Disponibilità e prezzo di eventuali verifiche esterne vengono comunicati prima di procedere.',
          ],
        },
        {
          heading: 'Richiesta controllo storico CARFAX',
          paragraphs: [
            'Scrivi a goosewebstore@gmail.com con oggetto “Richiesta controllo storico CARFAX” e indica il veicolo e il tipo di verifica che cerchi. Ti confermeremo se il controllo è disponibile, quali dati servono, cosa include, tempi e prezzo totale. Pagherai solo dopo aver ricevuto e accettato queste informazioni.',
            'La richiesta via email non comporta alcun addebito. Il controllo storico esterno non è incluso nell’analisi AutoEsperto da 1,99 € né nei piani mensile e annuale.',
          ],
        },
        {
          heading: 'Ufficio Stampa & Relazioni con i Media',
          paragraphs: [
            'Per richieste stampa e informazioni sul progetto: goosewebstore@gmail.com.',
          ],
        },
        {
          heading: 'Pubblicità e collaborazioni commerciali',
          paragraphs: [
            'Hai un’officina, una carrozzeria, un’attività legata all’auto o un servizio utile agli automobilisti? Puoi proporre una collaborazione o uno spazio pubblicitario su AutoEsperto, anche per attività locali.',
            'Scrivi a ralfhjavier@gmail.com indicando il nome dell’attività, la zona, il sito o i contatti e cosa vorresti promuovere. Valuteremo insieme disponibilità, formato e costi prima di qualsiasi accordo.',
            'Gli eventuali contenuti sponsorizzati saranno identificati chiaramente e i piani che prevedono l’esperienza senza pubblicità manterranno tale beneficio.',
          ],
        },
        {
          heading: 'Partner e investitori',
          paragraphs: [
            'Per collaborazioni con officine, periti, aziende o proposte di investimento: scrivi a ralfhjavier@gmail.com.',
          ],
        },
        {
          heading: 'Informazioni sul progetto',
          paragraphs: [
            'Piattaforma: AutoEsperto.it — Progetto tecnologico indipendente gestito da Ralfh (Sviluppatore Freelance)',
            'Sede operativa: Siracusa (SR), Italia',
            'Contatto generale e privacy: goosewebstore@gmail.com',
          ],
        },
      ]}
    />
  );
}
