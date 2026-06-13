import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import type { LoginResult, UserPublic } from '../types';
import { ERR_INVALID_CREDENTIALS } from '../constants';

export type { UserPublic, LoginResult };

export async function loginUser(username: string, password: string): Promise<LoginResult> {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new AppError(ERR_INVALID_CREDENTIALS, 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(ERR_INVALID_CREDENTIALS, 401);
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
  );

  return {
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
    token,
  };
}
