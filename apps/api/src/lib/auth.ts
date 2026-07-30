import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET non impostato nel .env');
  return secret;
}
const JWT_EXPIRES = '30d';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, getJwtSecret(), { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.userId = undefined;
    return next();
  }
  const token = header.slice(7);
  const decoded = verifyToken(token);
  if (decoded) {
    req.userId = decoded.userId;
    req.userRole = decoded.role;
  }
  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.userId) {
    return res.status(401).json({ success: false, error: 'Autenticazione richiesta' });
  }
  next();
}