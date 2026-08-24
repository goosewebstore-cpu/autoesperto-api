/**
 * Calcolo accurato Bollo Auto 2026 e Superbollo secondo le tariffe ordinarie italiane.
 */
export function extractKw(powerInput?: string | number): number {
  if (!powerInput) return 75; // Potenza media per utilitaria standard (circa 100 CV)

  if (typeof powerInput === 'number') {
    // Se il numero è > 170 è molto probabile che sia in CV (es. 190 CV -> 140 kW)
    return powerInput > 170 ? Math.round(powerInput * 0.735499) : powerInput;
  }

  const str = String(powerInput).trim().toLowerCase();

  // Cerca specifica esplicita di kW
  const kwMatch = str.match(/(\d+(?:[.,]\d+)?)\s*kw/i);
  if (kwMatch) {
    return Math.round(parseFloat(kwMatch[1].replace(',', '.')));
  }

  // Cerca specifica esplicita di CV
  const cvMatch = str.match(/(\d+(?:[.,]\d+)?)\s*(?:cv|hp|cavall)/i);
  if (cvMatch) {
    const cv = parseFloat(cvMatch[1].replace(',', '.'));
    return Math.round(cv * 0.735499);
  }

  // Estrai primo valore numerico
  const digits = parseInt(str.replace(/\D/g, ''), 10);
  if (!isNaN(digits) && digits > 0) {
    return digits > 170 ? Math.round(digits * 0.735499) : digits;
  }

  return 75;
}

export function calculateBolloAccurate(
  powerInput?: string | number,
  fuelInput?: string,
  yearInput?: number
): { bolloBase: number; superbollo: number; totale: number; isElectricExempt: boolean } {
  const kw = extractKw(powerInput);
  const fuel = (fuelInput || '').toLowerCase();
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - (yearInput || currentYear - 5));

  if (kw <= 0) {
    return { bolloBase: 0, superbollo: 0, totale: 0, isElectricExempt: false };
  }

  // 1. Esenzione Elettrica (BEV)
  if (fuel.includes('elettr') || fuel.includes('bev') || fuel === 'ev') {
    if (age <= 5) {
      return { bolloBase: 0, superbollo: 0, totale: 0, isElectricExempt: true };
    }
    // Dal 6° anno: 25% dell'importo ordinario
    const baseRate = kw <= 100 ? kw * 2.58 : 100 * 2.58 + (kw - 100) * 3.87;
    const bolloBase = Math.round(baseRate * 0.25);
    return { bolloBase, superbollo: 0, totale: bolloBase, isElectricExempt: false };
  }

  // 2. Calcolo Ordinario (Euro 4 - Euro 6)
  // Aliquota base ACI: 2.58 €/kW fino a 100 kW; 3.87 €/kW oltre 100 kW
  let baseRate = kw <= 100 ? kw * 2.58 : 100 * 2.58 + (kw - 100) * 3.87;

  // Auto ibride (HEV / PHEV): agevolazione media 50% nei primi 3 anni
  if ((fuel.includes('ibrid') || fuel.includes('hybrid') || fuel.includes('phev') || fuel.includes('hev')) && age <= 3) {
    baseRate *= 0.5;
  }

  // Auto GPL / Metano: riduzione ordinaria 25% (paga 75%)
  if (fuel.includes('gpl') || fuel.includes('metano') || fuel.includes('cng') || fuel.includes('lpg')) {
    baseRate *= 0.75;
  }

  // Auto storiche
  if (age >= 30) {
    return { bolloBase: 30, superbollo: 0, totale: 30, isElectricExempt: false };
  } else if (age >= 20) {
    baseRate *= 0.5;
  }

  let bolloBase = Math.round(baseRate);

  // 3. Superbollo (potenza > 185 kW)
  let superbollo = 0;
  if (kw > 185) {
    const extraKw = kw - 185;
    let ratePerKw = 20;
    if (age >= 20) ratePerKw = 0;
    else if (age >= 15) ratePerKw = 3;
    else if (age >= 10) ratePerKw = 6;
    else if (age >= 5) ratePerKw = 12;

    superbollo = Math.round(extraKw * ratePerKw);
  }

  const totale = bolloBase + superbollo;
  return { bolloBase, superbollo, totale, isElectricExempt: false };
}
