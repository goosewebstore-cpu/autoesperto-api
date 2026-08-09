import type { Metadata } from 'next';
import HomeClient, { type HomeInitialPayload } from '@/components/HomeClient';
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

interface HomePageProps {
  searchParams: Promise<{
    make?: string;
    model?: string;
    year?: string;
    km?: string;
    price?: string;
  }>;
}

function optionalNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function Home({ searchParams }: HomePageProps) {
  const query = await searchParams;
  let initialPayload: HomeInitialPayload = null;

  if (query.make && query.model) {
    initialPayload = {
      make: query.make,
      model: query.model,
      year: optionalNumber(query.year),
      km: optionalNumber(query.km),
      requestedPrice: optionalNumber(query.price),
    };
  }

  const makes = getAllMakes();
  const stats = {
    makes: makes.length,
    models: makes.reduce((total, make) => total + make.models.length, 0),
  };

  return (
    <>
      <HomeClient initialPayload={initialPayload} stats={stats} />
      <SiteFooter variant="full" />
    </>
  );
}
