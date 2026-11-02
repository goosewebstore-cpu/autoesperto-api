import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'ae_session';
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export async function POST(request: NextRequest) {
  let token: unknown;
  try {
    token = (await request.json())?.token;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  if (typeof token !== 'string' || token.length > 4096 || !TOKEN_PATTERN.test(token)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
