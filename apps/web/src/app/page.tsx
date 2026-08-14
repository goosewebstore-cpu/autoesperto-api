import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import SiteFooter from '@/components/SiteFooter';
import { getAllMakes } from '@/lib/catalogo';

export const metadata: Metadata = {
  title: 'Hai trovato un\'auto usata? Scopri se vale davvero quello che chiedono',
  description:
    'Analizza prezzo, valore, problemi e costi prima di comprare un\'auto usata. Verdetto in pochi secondi: BUON AFFARE, TRATTA o EVITALA. Prima analisi completa gratuita.',
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
