import { Request, Response, NextFunction } from 'express';
import { loginUser } from '../services/auth.service';
import { env } from '../config/env';
import type { LoginBody } from '../schemas/auth.schema';
import { COOKIE_NAME, COOKIE_MAX_AGE_MS } from '../constants';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, password } = req.body as LoginBody;

  try {
    const { user, token } = await loginUser(username, password);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE_MS,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'strict' });
  res.status(204).end();
}
