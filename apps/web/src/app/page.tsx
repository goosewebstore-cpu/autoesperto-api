import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import SiteFooter from '@/components/SiteFooter';
import { getAllMakes } from '@/lib/catalogo';

export const metadata: Metadata = {
  title: 'Analizza un\'auto usata: conviene comprarla? Verdetto gratis',
  description:
    'Analizza un\'auto usata con una foto o marca e modello. Prezzo di mercato, affidabilità e controlli prima dell\'acquisto. Verdetto in pochi secondi: BUON AFFARE, TRATTA o EVITALA. Gratis, senza registrazione.',
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

  return (
    <>
      <HomeClient stats={stats} />
      <SiteFooter variant="full" />
    </>
  );
}
