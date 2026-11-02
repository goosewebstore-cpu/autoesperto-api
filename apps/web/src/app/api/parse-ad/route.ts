import { NextResponse } from 'next/server';
import { parseListingTextOrUrl } from '@/lib/adParser';
import { extractListingHtml, supportedListingUrl } from '@/lib/listingHtml';
export async function POST(req:Request) {
  let input:string;
  try{const body=await req.json();input=String(body.url||body.text||'').trim();}catch{return NextResponse.json({error:'Richiesta non valida'},{status:400});}
  if(!input || input.length>30000)return NextResponse.json({error:'Inserisci un link o un testo valido.'},{status:400});
  const local=parseListingTextOrUrl(input);
  if(!/^https?:\/\//i.test(input))return NextResponse.json({success:true,data:{...local,source:'Testo annuncio'}});
  let url=supportedListingUrl(input);
  if(!url)return NextResponse.json({success:true,data:{...local,readStatus:'blocked',message:'Questo sito non è supportato dalla lettura automatica. Incolla il testo dell’annuncio e conferma i dati.'}});
  try{
    for(let redirects=0;redirects<4;redirects++){
      const res:Response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(8000),headers:{'User-Agent':'Mozilla/5.0 (compatible; AutoEsperto/1.0)','Accept':'text/html','Accept-Language':'it-IT,it;q=0.9'}});
      if(res.status>=300&&res.status<400){const location:string|null=res.headers.get('location');url=location ? supportedListingUrl(new URL(location,url).toString()) : null;if(!url)break;continue;}
      if(!res.ok || !res.headers.get('content-type')?.includes('text/html'))break;
      if(Number(res.headers.get('content-length')||0)>2500000)break;
      const reader=res.body?.getReader();if(!reader)break;const chunks:Uint8Array[]=[];let size=0;
      while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>2500000){await reader.cancel();throw Error('page size');}chunks.push(part.value);}
      const data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}
      const parsed=extractListingHtml(new TextDecoder().decode(data),url.toString());
      return NextResponse.json({success:true,data:{...parsed,source:url.hostname.replace(/^www\./,'')}});
    }
  }catch{ /* A blocked page is not evidence of vehicle details. */ }
  return NextResponse.json({success:true,data:{...local,readStatus:'blocked',message:'Il portale non ha reso leggibili i dettagli. Incolla anche il testo dell’annuncio oppure completa anno, chilometri e prezzo qui sotto.'}});
}
