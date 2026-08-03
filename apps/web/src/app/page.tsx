import HomeClient, { type HomeInitialPayload } from '@/components/HomeClient';

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

  return <HomeClient initialPayload={initialPayload} />;
}
