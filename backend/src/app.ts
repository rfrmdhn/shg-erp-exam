import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { env } from './config/env';
import { AppError } from './errors/AppError';
import { logger } from './config/logger';

export function createApp() {
  const app = express();

  app.use(helmet());

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    ?? (env.nodeEnv === 'production' ? [] : ['http://localhost:5173']);

  app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json());

  app.use('/api/v1', routes);

  // 404
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Error handler — AppError surfaces its own status; everything else is 500.
  // Four-parameter signature is required by Express to recognise error handlers.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    logger.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
