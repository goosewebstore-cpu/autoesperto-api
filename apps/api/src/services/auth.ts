import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../http';

const scryptAsync = promisify(scrypt);
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

interface AuthPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  auth: { userId: string };
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET deve contenere almeno 32 caratteri.');
  }
  return secret;
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [algorithm, salt, expectedHex] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function signAuthToken(userId: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({ sub: userId, iat: now, exp: now + TOKEN_TTL_SECONDS });
  const signature = createHmac('sha256', getSecret()).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyAuthToken(token: string): AuthPayload {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) throw unauthorized('Sessione non valida');

  const expected = createHmac('sha256', getSecret()).update(`${header}.${payload}`).digest();
  const received = Buffer.from(signature, 'base64url');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw unauthorized('Sessione non valida');
  }

  let parsed: AuthPayload;
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AuthPayload;
  } catch {
    throw unauthorized('Sessione non valida');
  }
  if (!parsed.sub || !parsed.exp || parsed.exp <= Math.floor(Date.now() / 1000)) {
    throw unauthorized('Sessione scaduta: accedi di nuovo');
  }
  return parsed;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authorization = req.header('authorization') || '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) throw unauthorized();
    const payload = verifyAuthToken(match[1]);
    (req as AuthenticatedRequest).auth = { userId: payload.sub };
    next();
  } catch (error) {
    next(error);
  }
}

export function normalizeIdentifier(raw: string): { email?: string; phone?: string } {
  const value = raw.trim();
  if (value.includes('@')) {
    const email = value.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      throw new Error('Inserisci un indirizzo email valido.');
    }
    return { email };
  }

  let phone = value.replace(/[\s().-]/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  if (!phone.startsWith('+') && /^3\d{9}$/.test(phone)) phone = `+39${phone}`;
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error('Inserisci un numero con prefisso internazionale, ad esempio +39.');
  }
  return { phone };
}
