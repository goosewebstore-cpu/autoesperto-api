import type { MarketListing, VehicleData } from '@autoesperto/types';

interface MarketplaceConfig {
  name: string;
  icon: string;
  color: string;
  searchUrl: (make: string, model: string, year: number, km: number, price: number) => string;
}

const marketplaces: MarketplaceConfig[] = [
  {
    name: 'AutoScout24',
    icon: 'A',
    color: '#004170',
    searchUrl: (make, model, year) =>
      `https://www.autoscout24.it/risultati/?cy=IT&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&fregfrom=${year - 2}&fregto=${year + 1}&sort=standard&search_id=`,
  },
  {
    name: 'Subito.it',
    icon: 'S',
    color: '#E60000',
    searchUrl: (make, model, year) =>
      `https://www.subito.it/annunci-italia/vendita/auto/?q=${encodeURIComponent(`${make} ${model}`)}&ps=${year - 2}&pe=${year + 1}`,
  },
  {
    name: 'Automobile.it',
    icon: 'Au',
    color: '#0A66C2',
    searchUrl: (make, model, year) =>
      `https://www.automobile.it/annunci/${make.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}/?annoDa=${year - 2}&annoA=${year + 1}`,
  },
  {
    name: 'Facebook Marketplace',
    icon: 'F',
    color: '#1877F2',
    searchUrl: (make, model, year) =>
      `https://www.facebook.com/marketplace/italy/vehicles?query=${encodeURIComponent(`${make} ${model}`)}&minYear=${year - 2}&maxYear=${year + 1}`,
  },
];

const cities = ['Milano', 'Roma', 'Napoli', 'Torino', 'Bologna', 'Firenze', 'Genova', 'Verona', 'Bari', 'Catania'];

function getMarketPriceEstimate(vehicle: VehicleData, value: number, year: number, km: number, index: number) {
  const yearDiff = year - vehicle.year!;
  const kmFactor = Math.max(0.6, 1 - (km - 50000) / 300000);
  const yearPenalty = yearDiff < 0 ? 1 + yearDiff * 0.06 : 1 - yearDiff * 0.05;
  const conditionFactor = 0.94 + Math.random() * 0.12;
  const basePrice = value * yearPenalty * kmFactor * conditionFactor;
  const variation = 0.95 + (index / 10);
  return Math.max(1500, Math.round(basePrice * variation / 50) * 50);
}

export function generateMarketListings(vehicle: VehicleData, value: number, inputKm?: number): MarketListing[] {
  const baseYear = vehicle.year || 2020;
  const listings: MarketListing[] = [];

  const kmValues = inputKm
    ? [
        Math.round(inputKm * 0.6),
        Math.round(inputKm * 0.85),
        inputKm,
        Math.round(inputKm * 1.2),
        Math.round(inputKm * 1.5),
      ]
    : [45000, 85000, 110000, 140000, 180000];

  const usedYears = new Set<number>();
  for (let i = 0; i < 5; i++) {
    let year: number;
    do {
      year = baseYear + Math.floor(Math.random() * 5) - 2;
    } while (usedYears.has(year));
    usedYears.add(year);

    const km = kmValues[i];
    const mp = marketplaces[i % marketplaces.length];
    const price = getMarketPriceEstimate(vehicle, value, year, km, i);
    const city = cities[(baseYear + i) % cities.length];

    listings.push({
      id: `listing-${i}-${Date.now()}`,
      title: `${vehicle.make} ${vehicle.model} ${year} ${vehicle.version || ''}`.trim(),
      price,
      km,
      year,
      city,
      source: mp.name,
      sourceUrl: mp.searchUrl(vehicle.make, vehicle.model, baseYear, km, price),
      imageUrl: vehicle.imageUrl,
    });
  }

  return listings.sort((a, b) => a.price - b.price);
}
