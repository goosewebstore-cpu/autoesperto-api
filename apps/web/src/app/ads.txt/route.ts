const publisherId = process.env.ADSENSE_PUBLISHER_ID || '';

export const dynamic = 'force-dynamic';

export function GET() {
  if (!/^pub-\d{16}$/.test(publisherId)) {
    return new Response('AdSense non ancora configurato.\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
