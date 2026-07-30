import type { MarketListing, VehicleData } from '@autoesperto/types';

const marketplaces = [
  { name: 'AutoScout24', url: 'https://www.autoscout24.it/' },
  { name: 'Subito.it', url: 'https://www.subito.it/auto/' },
  { name: 'Automobile.it', url: 'https://www.automobile.it/' },
  { name: 'Facebook Marketplace', url: 'https://www.facebook.com/marketplace/' },
];

const cities = ['Milano', 'Roma', 'Napoli', 'Torino', 'Bologna', 'Firenze', 'Genova', 'Verona', 'Bari', 'Catania'];

export function generateMarketListings(vehicle: VehicleData, value: number): MarketListing[] {
  const baseYear = vehicle.year || 2020;
  const name = `${vehicle.make} ${vehicle.model}`;
  const listings: MarketListing[] = [];

  for (let i = 0; i < 5; i++) {
    const yearOffset = i - 2;
    const year = baseYear + yearOffset;
    const km = 60000 + Math.floor(Math.random() * 120000);
    const yearFactor = 1 + ((baseYear - year) * 0.05);
    const kmFactor = 1 - ((km - 100000) / 400000);
    const conditionFactor = 0.92 + Math.random() * 0.16;
    const price = Math.max(1500, Math.round(value * yearFactor * kmFactor * conditionFactor / 50) * 50);
    const source = marketplaces[i % marketplaces.length];

    listings.push({
      id: `listing-${i}`,
      title: `${name} ${year}`,
      price,
      km,
      year,
      city: cities[Math.floor(Math.random() * cities.length)],
      source: source.name,
      sourceUrl: source.url,
      imageUrl: vehicle.imageUrl,
    });
  }

  return listings.sort((a, b) => a.price - b.price);
}
