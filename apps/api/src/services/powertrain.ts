/** Explicit fuel always takes precedence over model/brand defaults. */
export function isBatteryElectric(make: string = '', model: string = '', fuel?: string): boolean {
  const f = (fuel || '').trim().toLowerCase();
  if (/ibrid|hybrid|phev|hev|plug.?in|benzina|petrol|diesel|gasolio|gpl|metano/.test(f)) return false;
  if (/elettric|electric|\b(?:bev|ev)\b/.test(f)) return true;
  if (/^(tesla|polestar|lucid|rivian|nio|xpeng|fisker)$/i.test(make.trim())) return true;
  return /^(500e|taycan|id[. ]?[3457]|id[. ]?buzz|e-208|e-2008|leaf|zoe|enyaq|ev6|ioniq [56]|ariya|spring|mustang mach-e|eq[abc es]|ix[13]?|i[457]|q4 e-tron|e-tron)(?:$|\s)/i.test(model.trim());
}
