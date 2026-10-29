export function fuelFamily(value: string): string | undefined {
  const text = value.toLowerCase();
  if (/plug.?in|phev/.test(text)) return 'plugin';
  if (/ibrid|hybrid|\bhev\b/.test(text)) return 'hybrid';
  if (/elettr|electric|\bbev\b/.test(text)) return 'electric';
  if (/gpl|lpg/.test(text)) return 'gpl';
  if (/metano|cng/.test(text)) return 'metano';
  if (/diesel|gasolio|tdi|dci|hdi|multijet/.test(text)) return 'diesel';
  if (/benzina|petrol|gasoline|\btsi\b|\btfsi\b/.test(text)) return 'petrol';
  return undefined;
}

export function matchesVariant(text: string, fuel?: string, version?: string): boolean {
  const targetFuel = fuel ? fuelFamily(fuel) : undefined;
  if (targetFuel && fuelFamily(text) !== targetFuel) return false;
  // Named trim/engine is required when explicitly provided: no silent fallback
  // from a rare engine or trim to the prices of the whole model family.
  const tokens = (version || '').toLowerCase().match(/[\p{L}\p{N}]+(?:[.,][0-9]+)?/gu) || [];
  const normalized = text.toLowerCase().replace(/,/g, '.');
  return tokens.every((token) => normalized.includes(token.replace(/,/g, '.')));
}
