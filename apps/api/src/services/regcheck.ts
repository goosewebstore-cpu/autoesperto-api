import { HttpError, serviceUnavailable } from '../http';
import { RegCheckDemoData } from './demoData';

const API_BASE = 'https://www.regcheck.org.uk/api/reg.asmx';
const USERNAME = process.env.REGCHECK_USERNAME || 'demo';
const SERVICE_DOWN_MESSAGE = 'Servizio di ricerca veicoli temporaneamente non disponibile. Riprova più tardi.';
const DEMO_MODE = USERNAME === 'demo';

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
  const plateKey = plate.toUpperCase();
  if (DEMO_MODE) {
    const demoData = RegCheckDemoData[plateKey];
    if (demoData) return demoData;
  }

  const apiUrl = `${API_BASE}/CheckItaly?RegistrationNumber=${encodeURIComponent(plate)}&username=${encodeURIComponent(USERNAME)}`;
  return fetchRegCheck(apiUrl, plateKey);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}

async function fetchRegCheck(apiUrl: string, plateKey: string): Promise<RegCheckRawData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const resp = await fetch(apiUrl, { signal: controller.signal });
    const text = await resp.text();

    if (resp.status === 500 && text.toLowerCase().includes('out of credit')) {
      const demoData = RegCheckDemoData[plateKey];
      if (demoData) return demoData;
      throw serviceUnavailable(SERVICE_DOWN_MESSAGE);
    }

    if (!resp.ok) throw new Error(`Errore server ${resp.status}`);
    const match = text.match(/<vehicleJson>([\s\S]*?)<\/vehicleJson>/i);
    if (!match) throw new Error('Formato risposta non valido');
    return JSON.parse(decodeEntities(match[1]));
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw serviceUnavailable(SERVICE_DOWN_MESSAGE);
  } finally {
    clearTimeout(timeout);
  }
}

export function getTextValue(obj: unknown): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const value = obj as { CurrentTextValue?: string; CurrentValue?: string };
  return value.CurrentTextValue || value.CurrentValue || '';
}
