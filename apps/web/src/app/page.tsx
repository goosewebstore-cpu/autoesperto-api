import HomeClient, { type HomeInitialPayload } from '@/components/HomeClient';

interface HomePageProps {
  searchParams: {
    make?: string;
    model?: string;
    year?: string;
    km?: string;
    price?: string;
  };
}

function optionalNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function Home({ searchParams }: HomePageProps) {
  let initialPayload: HomeInitialPayload = null;

  if (searchParams.make && searchParams.model) {
    initialPayload = {
      make: searchParams.make,
      model: searchParams.model,
      year: optionalNumber(searchParams.year),
      km: optionalNumber(searchParams.km),
      requestedPrice: optionalNumber(searchParams.price),
    };
  }

  return <HomeClient initialPayload={initialPayload} />;
}
