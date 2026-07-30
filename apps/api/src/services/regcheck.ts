const API_BASE = 'https://www.regcheck.org.uk/api/reg.asmx';

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

export async function lookupPlate(plate: string): Promise<RegCheckRawData> {
  const apiUrl = `${API_BASE}/CheckItaly?RegistrationNumber=${encodeURIComponent(plate)}&username=demo`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const resp = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) throw new Error('Errore server ' + resp.status);
    const text = await resp.text();
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
    throw new Error(e.message || 'Richiesta fallita');
  }
}

export function getTextValue(obj: any): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj.CurrentTextValue || obj.CurrentValue || '';
}
