import { ImageResponse } from 'next/og';
import { findMakeBySlug, findModelBySlug } from '@/lib/catalogo';
import { siteUrl } from '@/lib/sitemaps';

const ACCENT = '#2563EB';
const BG = '#0F172A';

async function getFont(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
    { headers: { 'user-agent': 'curl/8.0.1' } }
  ).then((res) => res.text());
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
  if (!url) throw new Error('Font URL not found');
  return fetch(url).then((res) => res.arrayBuffer());
}

export async function GET(_request: Request, { params }: { params: Promise<{ make: string; model: string }> }) {
  const { make, model } = await params;
  const makeEntry = findMakeBySlug(make);
  if (!makeEntry) return new Response('Not found', { status: 404 });
  const modelName = findModelBySlug(makeEntry, model);
  if (!modelName) return new Response('Not found', { status: 404 });

  const [interBold, interExtrabold] = await Promise.all([getFont(700), getFont(800)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: BG,
          color: '#FFFFFF',
          padding: 56,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: ACCENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 26,
            }}
          >
            AE
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 800 }}>
            Auto<span style={{ color: ACCENT }}>Esperto</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, color: '#94A3B8', fontWeight: 700 }}>Valutazione auto usata</div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, marginTop: 10, lineHeight: 1.05 }}>
            {makeEntry.name} {modelName}
          </div>
          <div style={{ fontSize: 32, color: '#CBD5E1', marginTop: 16, fontWeight: 700 }}>
            Quanto costa usata? Prezzo medio reale dagli annunci
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 24, color: '#60A5FA', fontWeight: 800 }}>Valutazione gratuita</div>
          <div style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: '#475569' }} />
          <div style={{ fontSize: 24, color: '#94A3B8', fontWeight: 700 }}>{new URL(siteUrl).host}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interBold, weight: 700 },
        { name: 'Inter', data: interExtrabold, weight: 800 },
      ],
    }
  );
}
