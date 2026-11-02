import type { VehicleData } from '@autoesperto/types';
const slug=(v:string,separator='-')=>v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/[\s-]+/g,separator);
export function marketPortalLinks(vehicle:VehicleData) {
  const make=slug(vehicle.make);const model=slug(vehicle.model);const year=vehicle.year && Number.isInteger(vehicle.year) ? vehicle.year : undefined;
  const a=new URL(`https://www.autoscout24.it/lst/${make}/${model}`);a.searchParams.set('cy','I');if(year){a.searchParams.set('fregfrom',String(year));a.searchParams.set('fregto',String(year));}
  const s=new URL(`https://www.subito.it/annunci-italia/vendita/auto/${make}/${model}/`);if(year){s.searchParams.set('ys',String(year));s.searchParams.set('ye',String(year));}
  const b=new URL(`https://www.automobile.it/${make}-${slug(vehicle.model,'_')}`);
  return [{name:'AutoScout24',logo:'autoscout24',url:a.toString(),filter:year ? `Modello e anno ${year}` : 'Ricerca per modello'},{name:'Subito.it',logo:'subito',url:s.toString(),filter:year ? `Modello e anno ${year}` : 'Ricerca per modello'},{name:'Automobile.it',logo:'automobile',url:b.toString(),filter:'Ricerca per modello; verifica anno e km sul portale'}];
}
