import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import SiteFooter from '@/components/SiteFooter';
import { getAllMakes } from '@/lib/catalogo';

export const metadata: Metadata = {
  title: 'Prima di comprare, verifica l\'auto: prezzo, affidabilità e controlli',
  description:
    'Da una foto o da marca e modello: scopri quanto vale un\'auto usata, se il prezzo è giusto e cosa controllare prima di comprare o vendere. Report completo in pochi secondi, prima analisi gratuita.',
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
