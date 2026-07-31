import type { MarketLink, VehicleData } from '@autoesperto/types';

export function getMarketSearchUrls(vehicle: VehicleData): MarketLink[] {
  const year = vehicle.year || 2020;
  const make = encodeURIComponent(vehicle.make);
  const model = encodeURIComponent(vehicle.model);
  const query = encodeURIComponent(`${vehicle.make} ${vehicle.model}`);

  return [
    {
      source: 'AutoScout24',
      url: `https://www.autoscout24.it/risultati/?cy=IT&make=${make}&model=${model}&fregfrom=${year - 2}&fregto=${year + 1}&sort=standard`,
    },
    {
      source: 'Subito.it',
      url: `https://www.subito.it/annunci-italia/vendita/auto/?q=${query}&ps=${year - 2}&pe=${year + 1}`,
    },
    {
      source: 'Automobile.it',
      url: `https://www.automobile.it/annunci/${vehicle.make.toLowerCase()}-${vehicle.model.toLowerCase().replace(/\s+/g, '-')}/?annoDa=${year - 2}&annoA=${year + 1}`,
    },
  ];
}
