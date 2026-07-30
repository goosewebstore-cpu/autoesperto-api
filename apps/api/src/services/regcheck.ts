import { RegCheckDemoData } from './demoData';

const API_BASE = 'https://www.regcheck.org.uk/api/reg.asmx';
const USERNAME = process.env.REGCHECK_USERNAME || 'demo';

export interface RegCheckRawData {
  Description?: string;
  RegistrationYear?: string;
  CarMake?: { CurrentTextValue?: string } | string;
  CarModel?: { CurrentTextValue?: string } | string;
  EngineSize?: { CurrentTextValue?: string } | string;
  FuelType?: { CurrentTextValue?: string } | string;
  NumberOfDoors?: string;
  NumberOfSeats?: { CurrentTextValue?: string } | string;
  Version?: string;
  BodyStyle?: { CurrentTextValue?: string } | string;
  Transmission?: { CurrentTextValue?: string } | string;
  Colour?: string;
  EuroStatus?: string;
  ImageUrl?: string;
  Vin?: string;
  PowerCV?: string;
  Co2?: string;
  Weight?: string;
  InsuranceGroup?: string;
  Mileage?: string;
}

let useDemoFallback = USERNAME === 'demo';

export async function lookupPlate(plate: string): Promise<RegCheckRawData> {
  if (useDemoFallback) {
    const demoData = RegCheckDemoData[plate.toUpperCase()];
    if (demoData) return demoData;
    const apiUrl = `${API_BASE}/CheckItaly?RegistrationNumber=${encodeURIComponent(plate)}&username=${USERNAME}`;
    const data = await fetchRegCheck(apiUrl, plate);
    return data;
  }

  const apiUrl = `${API_BASE}/CheckItaly?RegistrationNumber=${encodeURIComponent(plate)}&username=${USERNAME}`;
  const data = await fetchRegCheck(apiUrl, plate);
  return data;
}

async function fetchRegCheck(apiUrl: string, plate: string): Promise<RegCheckRawData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const resp = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);
    const text = await resp.text();

    if (resp.status === 500 && text.toLowerCase().includes('out of credit')) {
      useDemoFallback = true;
      if (USERNAME === 'demo') {
        const demoData = RegCheckDemoData[plate.toUpperCase()];
        if (demoData) return demoData;
      }
      throw new Error('Crediti API esauriti. Ricarica il tuo account su www.regcheck.org.uk oppure imposta REGCHECK_USERNAME nel file .env.');
    }

    if (!resp.ok) throw new Error('Errore server ' + resp.status);
    const m = text.match(/<vehicleJson>([\s\S]*?)<\/vehicleJson>/i);
    if (!m) throw new Error('Formato risposta non valido');
    const json = m[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
    return JSON.parse(json);
  } catch (e: any) {
    clearTimeout(timeout);
    if (e.message && e.message.includes('Crediti API esauriti')) throw e;
    throw new Error(e.message || 'Richiesta fallita');
  }
}

export function getTextValue(obj: any): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj.CurrentTextValue || obj.CurrentValue || '';
}
