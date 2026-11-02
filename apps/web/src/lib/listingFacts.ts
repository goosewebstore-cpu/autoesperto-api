/** Locale-aware numeric fields used by listing text and JSON-LD. */
export function listingNumber(value: unknown): number | undefined {
  if(typeof value==='number')return Number.isFinite(value) ? value : undefined;
  if(value && typeof value==='object')return listingNumber((value as {value?:unknown}).value);
  if(typeof value!=='string')return;
  let raw=value.trim().replace(/[^\d.,\s\u00a0]/g,'').replace(/[\s\u00a0]/g,'');
  if(!raw)return;
  raw=raw.replace(/([.,])(?=\d{3}(?:[.,]|$))/g,'');
  if(raw.includes(',') && raw.includes('.'))raw=raw.lastIndexOf(',')>raw.lastIndexOf('.') ? raw.replace(/\./g,'').replace(',','.') : raw.replace(/,/g,'');
  else raw=raw.replace(',','.');
  const n=Number(raw);return Number.isFinite(n) ? n : undefined;
}
export function listingYear(value:unknown):number|undefined {
  if(typeof value!=='string' && typeof value!=='number')return;
  const match=String(value).match(/(?:^|\D)((?:19|20)\d{2})(?:\D|$)/);const n=match ? Number(match[1]) : undefined;
  return n && n>=1900 && n<=new Date().getFullYear()+1 ? n : undefined;
}
