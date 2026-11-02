import type { AutoReport } from '@autoesperto/types';
import { isKnownBatteryElectric, resolveVehicleFuel } from './powertrain';
export function repairLegacyElectricReport(report:AutoReport):{report:AutoReport;needsRefresh:boolean} {
  if(!isKnownBatteryElectric(report.vehicle.make,report.vehicle.model) || /elettric|electric|\bbev\b/i.test(report.vehicle.fuel || ''))return {report,needsRefresh:false};
  const costs={...report.reliability.futureCosts};
  for(const key of ['fuelCostPer100Km','annualMaintenance']as const)delete (costs as Partial<typeof costs>)[key];
  const fixed:AutoReport={...report,vehicle:{...report.vehicle,fuel:resolveVehicleFuel(report.vehicle.make,report.vehicle.model),transmission:'Automatico'},reliability:{...report.reliability,consumption:undefined,taxAnnual:undefined,futureCosts:costs},price:{...report.price,comment:'Alimentazione corretta in elettrica. Aggiorna la valutazione per ricalcolare prezzo e costi sui dati corretti.'}};
  return {report:fixed,needsRefresh:true};
}
