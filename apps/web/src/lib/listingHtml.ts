import { parseListingTextOrUrl, type ParsedAdData } from './adParser';
import { listingNumber, listingYear } from './listingFacts';
import { resolveVehicleFuel } from './powertrain';
const safeUrl=(v:unknown)=>typeof v==='string' && /^https?:\/\//i.test(v) ? v : undefined;
function attributes(tag:string) { const a:Record<string,string>={};for(const m of tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g))a[m[1].toLowerCase()]=m[2];return a; }
const decoded=(s:string)=>s.replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&amp;/g,'&').replace(/&nbsp;/g,' ');
export function extractListingHtml(html:string,url:string):ParsedAdData {
  const fallback=parseListingTextOrUrl(url);const candidates:ParsedAdData[]=[];
  const visit=(item:any,depth=0)=>{if(!item || depth>12)return;if(Array.isArray(item)){item.slice(0,100).forEach(v=>visit(v,depth+1));return;}if(typeof item!=='object')return;
    if((Array.isArray(item['@type']) ? item['@type'] : [item['@type']]).some((type:unknown)=>/^(Car|Vehicle|Product|IndividualProduct)$/i.test(String(type || '')))){
      const offer=Array.isArray(item.offers) ? item.offers[0] : item.offers;
      const brand=typeof item.brand==='object' ? item.brand?.name : item.brand || item.manufacturer?.name || item.manufacturer;
      const name=typeof item.name==='string' ? item.name : '';
      const guessed=parseListingTextOrUrl(`${brand || ''} ${typeof item.model==='string' ? item.model : ''} ${name} ${item.description || ''}`);
      const mileage=item.mileageFromOdometer ?? item.mileage ?? item.kilometers;
      let km=listingNumber(mileage);const unit=typeof mileage==='object' ? mileage.unitCode : String(mileage);
      if(km!=null && /(?:SMI|\bmiles?\b)/i.test(unit || ''))km=Math.round(km*1.609344);
      const dateKey=Object.keys(item).find(k=>/^(datevehiclefirstregistered|datefirstregistration|firstregistrationdate|registrationdate)$/i.test(k));
      const year=listingYear(dateKey ? item[dateKey] : item.vehicleModelDate ?? item.productionDate);
      const price=listingNumber(offer?.price ?? offer?.priceSpecification?.price);
      const fuel=typeof item.fuelType==='string' ? item.fuelType : item.vehicleEngine?.fuelType;
      const rawModel=typeof item.model==='object' ? item.model?.name : item.model;
      candidates.push({...guessed,make:typeof brand==='string' ? brand : guessed.make,model:typeof rawModel==='string' ? rawModel : guessed.model,title:name || undefined,year,km:km!=null&&km>=0&&km<=1000000 ? Math.round(km) : undefined,price:price!=null&&price>0&&price<=10000000 ? price : undefined,fuel:typeof fuel==='string' ? fuel : guessed.fuel,photo:safeUrl(Array.isArray(item.image) ? item.image[0] : typeof item.image==='object' ? item.image?.url : item.image),transmission:item.vehicleTransmission ? /automatic|cambio automatico/i.test(item.vehicleTransmission) ? 'Automatico' : /manual/i.test(item.vehicleTransmission) ? 'Manuale' : undefined : guessed.transmission});
    }
    // Follow graph / main entity only: recommendation widgets are not the selected car.
    for(const key of ['@graph','mainEntity','itemOffered'])if(item[key])visit(item[key],depth+1);
  };
  for(const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{visit(JSON.parse(m[1]));}catch{}}
  const tokens=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
  const score=(c:ParsedAdData)=>(c.make&&tokens(c.make)===tokens(fallback.make||'') ? 10 : 0)+(c.model&&tokens(url).includes(tokens(c.model)) ? 10 : 0)+['year','km','price'].filter(k=>c[k as keyof ParsedAdData]!=null).length;
  // Some portals publish selected-vehicle data in their app payload instead of JSON-LD.
  if(!candidates.length){
    const walk=(node:any,depth=0)=>{
      if(!node || depth>14)return;
      if(Array.isArray(node)){node.slice(0,50).forEach(item=>walk(item,depth+1));return;}
      if(typeof node!=='object')return;
      const make=typeof node.make==='string' ? node.make : typeof node.brand==='string' ? node.brand : node.make?.name;
      const model=typeof node.model==='string' ? node.model : node.model?.name;
      const matches=make&&model&&tokens(url).includes(tokens(make))&&tokens(url).includes(tokens(model));
      if(matches){
        const km=listingNumber(node.mileage ?? node.kilometers ?? node.km);
        const price=listingNumber(node.price?.amount ?? node.price?.value ?? node.price);
        const year=listingYear(node.firstRegistrationDate ?? node.firstRegistration ?? node.registrationDate ?? node.year ?? node.productionYear);
        if([km,price,year].filter(value=>value!=null).length>=2)candidates.push({make,model,km,price,year,fuel:typeof (node.fuelType?.name || node.fuelType || node.fuel)==='string' ? node.fuelType?.name || node.fuelType || node.fuel : undefined,transmission:typeof (node.transmission?.name || node.transmission)==='string' ? node.transmission?.name || node.transmission : undefined});
      }
      for(const [key,value]of Object.entries(node))if(!/recommend|similar|related|filter|translation|searchresult|inventory/i.test(key))walk(value,depth+1);
    };
    for(const m of html.matchAll(/<script\b[^>]*id=["'](?:__NEXT_DATA__|__INITIAL_STATE__)["'][^>]*>([\s\S]*?)<\/script>/gi)){try{walk(JSON.parse(m[1]));}catch{}}
  }
  candidates.sort((a,b)=>score(b)-score(a));
  const selected=candidates[0];const info:ParsedAdData={...fallback};
  if(selected)for(const [key,value]of Object.entries(selected))if(value!=null && value!=='') (info as any)[key]=value;
  const meta:Record<string,string>={};for(const m of html.matchAll(/<meta\b[^>]*>/gi)){const a=attributes(m[0]);if(a.content)meta[a.property||a.name]=decoded(a.content);}
  const title=meta['og:title'] || decoded(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '');
  if(!info.title && title)info.title=title;
  const details=parseListingTextOrUrl(`${title}\n${meta['og:description'] || meta.description || ''}`);
  for(const key of ['make','model','year','km','price','fuel','transmission']as const)if(info[key]==null && details[key]!=null)(info as any)[key]=details[key];
  if(!info.photo)info.photo=safeUrl(meta['og:image']);
  const metadataPrice=listingNumber(meta['product:price:amount'] || meta['og:price:amount']);if(info.price==null && metadataPrice!=null && metadataPrice>0)info.price=metadataPrice;
  info.fuel=resolveVehicleFuel(info.make,info.model,info.fuel);
  info.readStatus=info.year!=null&&info.km!=null&&info.price!=null ? 'complete' : 'partial';
  if(info.readStatus==='partial')info.message='Alcuni dati non sono pubblicati in un formato leggibile. Copia il testo dell’annuncio o completa i campi mancanti prima di confermare.';
  return info;
}
export function supportedListingUrl(raw:string): URL | null {
  try{const u=new URL(raw);if(u.protocol!=='https:' || u.port || u.username || u.password)return null;const host=u.hostname.toLowerCase();return ['autohero.com','autoscout24.it','autoscout24.com','subito.it','automobile.it','carvago.com','brumbrum.it','facebook.com'].some(domain=>host===domain||host.endsWith('.'+domain)) ? u : null;}catch{return null;}
}
