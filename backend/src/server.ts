import { createApp } from './app';
import { sequelize } from './models';
import { env } from './config/env';

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
