// Sequelize CLI config. Reads from the backend's .env (loaded by the CLI via dotenv).
// Used by `npm run migrate` / `npm run seed` in the backend folder.
require('dotenv').config();

const common = {
  username: process.env.DB_USER || 'siloam',
  password: process.env.DB_PASSWORD || 'siloam',
  database: process.env.DB_NAME || 'siloam_vendor',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
