import type { AutoReport } from '@autoesperto/types';
import { marketPortalLinks } from '../marketPortalLinks';
/** Export only report data; camera data URLs and UI state are never sent to the PDF service. */
export function sanitizePdfReport(input:AutoReport):AutoReport {
  function clean(value:unknown,key='',depth=0):unknown {
    if(depth>10 || /^(?:image|imageUrl|photo|photoUrl|photos|mainPhoto|imageData|rawHtml|rawText)$/i.test(key))return undefined;
    if(typeof value==='string')return /^data:(?:image|application)\//i.test(value) ? undefined : value.slice(0,6000);
    if(typeof value==='number')return Number.isFinite(value) ? value : undefined;
    if(Array.isArray(value))return value.slice(0,100).map(item=>clean(item,'',depth+1)).filter(v=>v!==undefined);
    if(value && typeof value==='object'){const out:Record<string,unknown>={};for(const [k,v]of Object.entries(value)){const c=clean(v,k,depth+1);if(c!==undefined)out[k]=c;}return out;}
    return value===null || typeof value==='boolean' ? value : undefined;
  }
  const result=clean({vehicle:input.vehicle,reliability:input.reliability,price:input.price,alternatives:input.alternatives,photoAnalysis:input.photoAnalysis,createdAt:input.createdAt,userTools:(input as any).userTools}) as AutoReport;
  for(const key of ['estimatedValue','min','max','requestedPrice','inputKm','inputYear']as const){const n=Number(result.price?.[key]);if(result.price?.[key]!=null && Number.isFinite(n))result.price[key]=n;}
  if(result.reliability.consumption){for(const key of ['combined','city','highway'] as const){const value=Number(result.reliability.consumption[key]);if(Number.isFinite(value))result.reliability.consumption[key]=value;}}
  result.price.marketUrls=marketPortalLinks(result.vehicle).map(link=>({source:link.name,url:link.url}));
  return result;
}
