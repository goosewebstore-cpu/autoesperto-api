import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { getAllMakes } from '@/lib/catalogo';

export const metadata: Metadata = {
  title: 'Valutazione Auto Usata Gratis: Prezzo di Mercato, Affidabilità e Verdetto | AutoEsperto',
  description:
    'Valutazione auto usate gratuita e senza registrazione. Scopri il prezzo di mercato reale, l\'affidabilità, i problemi noti e i costi di manutenzione. Verdetto in pochi secondi: BUON AFFARE, TRATTA IL PREZZO o EVITALA.',
  alternates: {
    canonical: '/',
    languages: { 'it-IT': 'https://autoesperto.it/' },
  },
};

export default function Home() {
  const makes = getAllMakes();
  const stats = {
    makes: makes.length,
    models: makes.reduce((total, make) => total + make.models.length, 0),
  };

  return <HomeClient stats={stats} />;
}
