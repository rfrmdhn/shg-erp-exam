import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../types';
import { jwtPayloadSchema } from '../schemas/auth.schema';
import { COOKIE_NAME } from '../constants';

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  // Accept token from httpOnly cookie (primary) or Authorization header (API clients / tests).
  const cookieToken = req.cookies[COOKIE_NAME] as string | undefined;
  const header = req.headers.authorization;
  const token =
    cookieToken ??
    (header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined);

  if (!token) {
    res.status(401).json({ message: 'Missing or invalid Authorization header' });
    return;
  }

  try {
    const raw = jwt.verify(token, env.jwt.secret);
    const payload = jwtPayloadSchema.parse(raw);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
