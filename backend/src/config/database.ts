import { Sequelize } from 'sequelize';
import { env } from './env';

// Use an in-memory-ish lightweight config for tests so Jest doesn't need a live DB.
// For dev/prod, connect to Postgres using env values.
export const sequelize =
  env.nodeEnv === 'test'
    ? new Sequelize('sqlite::memory:', { logging: false })
    : new Sequelize(env.db.name, env.db.user, env.db.password, {
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres',
        logging: false,
      });
