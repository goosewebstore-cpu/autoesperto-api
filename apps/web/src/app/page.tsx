import type { Metadata } from 'next';
import HomeClient, { type HomeInitialPayload } from '@/components/HomeClient';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Analizza l\'auto: vale il prezzo che ti chiedono?',
  description:
    'Carica una foto o inserisci i dati dell\'auto. Scopri quanto vale sul mercato, se il prezzo è giusto e cosa controllare prima di comprare o vendere. Report completo in pochi secondi.',
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

  return (
    <>
      <HomeClient initialPayload={initialPayload} />
      <SiteFooter variant="full" />
    </>
  );
}
