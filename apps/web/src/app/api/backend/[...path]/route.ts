import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'ae_session';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production'
  ? 'https://autoesperto-api.onrender.com'
  : 'http://localhost:4000');

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (!path?.length || path.some((part) => part === '.' || part === '..')) {
    return NextResponse.json({ success: false, error: 'Percorso non valido' }, { status: 400 });
  }

  const target = new URL(path.map(encodeURIComponent).join('/'), `${BACKEND_URL.replace(/\/$/, '')}/`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const accept = request.headers.get('accept');
  if (contentType) headers.set('Content-Type', contentType);
  if (accept) headers.set('Accept', accept);
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) headers.set('Authorization', `Bearer ${token}`);

  if (path.join('/') === 'auth/me' && !token) return NextResponse.json({ success: false, error: 'Accedi per continuare.', needsLogin: true }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const guest = (await cookies()).get('ae_guest_trial')?.value;
  if (guest && /^[a-f0-9]{64}$/.test(guest)) headers.set('Cookie', 'ae_guest_trial=' + guest);

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      ...(request.method === 'GET' || request.method === 'HEAD' ? {} : { body: await request.arrayBuffer() }),
      cache: 'no-store',
      redirect: 'manual',
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Servizio temporaneamente non disponibile' }, { status: 502 });
  }

  const responseHeaders = new Headers();
  for (const name of ['content-type', 'cache-control', 'location', 'retry-after', 'set-cookie']) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  responseHeaders.set('Cache-Control', 'no-store');

  const isAuthRoute = path[0] === 'auth' && ['register', 'login', 'verify-email'].includes(path[1] || '');
  if (isAuthRoute && upstream.ok && upstream.headers.get('content-type')?.includes('application/json')) {
    try {
      const payload = await upstream.json() as Record<string, unknown>;
      const authToken = payload.token;
      if (typeof authToken === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(authToken)) {
        delete payload.token;
        const response = NextResponse.json(payload, { status: upstream.status, headers: responseHeaders });
        response.cookies.set(SESSION_COOKIE, authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
        return response;
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Risposta non valida dal servizio' }, { status: 502 });
    }
  }

  return new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders });
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
