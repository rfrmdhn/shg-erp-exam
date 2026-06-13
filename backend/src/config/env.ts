import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (value) return value;
  throw new Error(`Environment variable ${key} is required`);
}

function requireInProd(key: string, devFallback: string): string {
  const value = process.env[key];
  if (value) return value;
  if ((process.env.NODE_ENV ?? 'development') === 'production') {
    throw new Error(`Environment variable ${key} must be set in production`);
  }
  return devFallback;
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'siloam',
    password: requireInProd('DB_PASSWORD', 'siloam'),
    name: process.env.DB_NAME || 'siloam_vendor',
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
