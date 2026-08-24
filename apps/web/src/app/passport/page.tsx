import type { Metadata } from 'next';
import PassportIndexClient from './PassportIndexClient';

export const metadata: Metadata = {
  title: 'Profilo Digitale Auto | AutoEsperto — Il Profilo Permanente della tua Macchina',
  description:
    'Conserva analisi, foto, documenti, valore di mercato, cronologia tagliandi e scadenze della tua auto nel tuo Profilo Digitale AutoEsperto.',
};

export default function PassportPage() {
  return <PassportIndexClient />;
}
