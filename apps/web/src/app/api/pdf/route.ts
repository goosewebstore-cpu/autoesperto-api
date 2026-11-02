import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { AutoReport } from '@autoesperto/types';
import { buildReportPdf } from '@/lib/pdf/buildReportPdf';
import { sanitizePdfReport } from '@/lib/pdf/sanitize';
import { canExportPremiumPdf } from '@/lib/pdf/access';
import type { AccountUser } from '@/lib/api';
import type { PDFConditionData } from '@/lib/pdf/types';

export const runtime = 'nodejs';
const error = (message: string, status: number) => NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
function bounded(value: unknown, depth = 0): boolean {
  if(depth > 12) return false;
  if(typeof value === 'string') return value.length <= 8000;
  if(typeof value === 'number') return Number.isFinite(value);
  if(Array.isArray(value)) return value.length <= 200 && value.every(item => bounded(item,depth+1));
  if(value && typeof value === 'object') return Object.keys(value).length <= 100 && Object.values(value).every(item => bounded(item,depth+1));
  return value === null || typeof value === 'boolean';
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins=new Set(['https://autoesperto.it','https://www.autoesperto.it',request.nextUrl.origin]);
  if(process.env.NODE_ENV!=='production' && origin && /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin))allowedOrigins.add(origin);
  if(origin && !allowedOrigins.has(origin)) return error('Richiesta non consentita.',403);
  if(Number(request.headers.get('content-length') || 0)>2500000) return error('Report troppo grande.',413);
  let body;
  try { const raw=await request.text(); if(raw.length>2500000) return error('Report troppo grande.',413); body=JSON.parse(raw); } catch { return error('Report non valido.',400); }
  if(body?.report?.vehicle && body?.report?.price && body?.report?.reliability) body.report=sanitizePdfReport(body.report);
  if(!body || !bounded(body) || !['basic','premium','auto'].includes(body.edition) || !body.report?.vehicle || !body.report?.price || !body.report?.reliability || typeof body.report.vehicle.make !== 'string' || typeof body.report.vehicle.model !== 'string') return error('Dati del report non validi.',400);
  let premium=false;
  if(body.edition !== 'basic') {
    const token=(await cookies()).get('ae_session')?.value;
    if(token) {
      const backend=process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV==='production' ? 'https://autoesperto-api.onrender.com' : 'http://localhost:4000');
      try {
        const response=await fetch(`${backend.replace(/\/$/,'')}/auth/me`,{headers:{Authorization:`Bearer ${token}`},cache:'no-store',signal:AbortSignal.timeout(12000)});
        if(response.ok){ const payload=await response.json() as {user:AccountUser};premium=canExportPremiumPdf(payload.user); }
      } catch { if(body.edition==='premium') return error('Impossibile verificare l’abbonamento. Riprova tra poco.',503); }
    }
    if(body.edition==='premium' && !premium) return error('Il PDF completo richiede un abbonamento attivo. La sintesi gratuita è sempre disponibile.',403);
  }
  const edition=body.edition==='basic' || !premium ? 'basic' : 'premium';
  try {
    const pdf=buildReportPdf(body.report as AutoReport,edition,edition==='premium' ? body.conditionData as PDFConditionData | undefined : undefined);
    return new NextResponse(pdf as BodyInit,{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="AutoEsperto-${edition==='premium' ? 'Completo' : 'Sintesi'}.pdf"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','X-PDF-Edition':edition}});
  } catch (cause) { console.error('PDF generation failed:',cause instanceof Error ? cause.message : 'unknown'); return error('Non è stato possibile creare il PDF in questo momento. Riprova tra poco.',500); }
}
