/** Rules for unambiguous battery electric identities, before untrusted text fuel. */
export function isKnownBatteryElectric(make = '', model = ''): boolean {
  const m=model.trim();
  if (/^(tesla|lucid|rivian|nio|xpeng)$/i.test(make.trim())) return true;
  if (/^polestar$/i.test(make.trim())) return /^(2|3|4|5|6)(?:\b|$)/.test(m);
  if (/^mg$/i.test(make.trim()) && /^(?:mg\s+)?marvel\s*r\b/i.test(m)) return true;
  return /^(500e|taycan|id[. ]?[3457]|id[. ]?buzz|e-208|e-2008|leaf|zoe|enyaq|ev6|ioniq [56]|ariya|spring|mustang mach-e|eqa|eqb|eqc|eqe|eqs|ix|ix1|ix3|i4|i5|i7|q4 e-tron|e-tron)(?:$|\s)/i.test(m);
}
export function resolveVehicleFuel(make = '', model = '', fuel?: string): string | undefined {
  if(isKnownBatteryElectric(make,model))return 'Elettrica';
  const f=fuel?.trim();if(!f)return undefined;
  if(/ibrid|hybrid|phev|mhev|hev|plug.?in/i.test(f))return 'Ibrida';
  if(/elettric|electric|\bbev\b/i.test(f))return 'Elettrica';
  if(/gpl|lpg/i.test(f))return 'GPL';
  if(/metano|cng/i.test(f))return 'Metano';
  if(/diesel|gasolio/i.test(f))return 'Diesel';
  if(/benzina|petrol|gasoline/i.test(f))return 'Benzina';
  return f;
}
export function isBatteryElectric(make = '', model = '', fuel?: string): boolean {
  if(isKnownBatteryElectric(make,model))return true;
  const f=(fuel || '').trim().toLowerCase();
  if(/ibrid|hybrid|phev|hev|plug.?in|benzina|petrol|diesel|gasolio|gpl|metano/.test(f))return false;
  return /elettric|electric|\b(?:bev|ev)\b/.test(f);
}
