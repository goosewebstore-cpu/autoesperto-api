import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveVehicleFuel,isBatteryElectric } from '../src/services/powertrain';
import { buildReport } from '../src/services/reportService';
import { getMarketSearchUrls } from '../src/services/market';
test('Tesla con alimentazione incoerente: normalizzata prima di ricerca, costi e cache',async()=>{const original=globalThis.fetch;globalThis.fetch=(async()=>new Response('',{status:503})) as typeof fetch;try{const {report}=await buildReport({make:'Tesla',model:'Model 3',year:2021,km:50000,requestedPrice:25000,fuel:'GPL'});assert.equal(report.vehicle.fuel,'Elettrica');assert.equal(report.vehicle.transmission,'Automatico');assert.ok(!/gpl|diesel|benzina/i.test(report.reliability.consumption?.fuelType || ''));}finally{globalThis.fetch=original;}});
test('Riconoscimento elettrico non forza una Polestar 1 o una Panda GPL',()=>{assert.equal(resolveVehicleFuel('MG','Marvel R','Diesel'),'Elettrica');assert.equal(isBatteryElectric('Polestar','1','Ibrida'),false);assert.equal(resolveVehicleFuel('Fiat','Panda','GPL'),'GPL');});
test('Link mercato dedicati al modello; nessun anno inventato',()=>{const links=getMarketSearchUrls({make:'Tesla',model:'Model 3',year:2020});assert.match(links[0].url,/lst\/tesla\/model-3/);assert.match(links[2].url,/tesla-model_3/);assert.ok(!getMarketSearchUrls({make:'Fiat',model:'Panda'})[0].url.includes('2020'));});
