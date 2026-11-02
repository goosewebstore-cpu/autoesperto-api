import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'ae_session';
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const destination = new URL('/accesso?google=1', request.url);
  const response = NextResponse.redirect(destination);
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');

  if (!token || token.length > 4096 || !TOKEN_PATTERN.test(token)) {
    return NextResponse.redirect(new URL('/accesso?err=1', request.url));
  }

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
