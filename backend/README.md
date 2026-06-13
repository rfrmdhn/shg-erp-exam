# Backend — Siloam Vendor Management API

ExpressJS · Sequelize · TypeScript · Jest. Authenticates users (JWT) and serves a
**per-unit** vendor list + vendor creation.

> Part of the [Siloam Vendor Management](../README.md) monorepo.
> See also: [frontend/](../frontend/README.md) · [database/](../database/README.md)

## Prerequisites

- Node.js 18+
- A running PostgreSQL (use the root [`docker compose up -d`](../README.md#quick-start))

## Setup

```bash
cp .env.example .env      # adjust if your DB differs from docker-compose defaults
npm install
npm run db:setup          # run migrations + seeders (lives in ../database)
npm run dev               # http://localhost:3000
```

> `db:setup` is optional if you provisioned the DB via the root Docker init SQL — the
> schema and seed are already loaded in that case.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with hot reload (ts-node-dev) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run the compiled server |
| `npm run migrate` / `migrate:undo` | Sequelize migrations (against `../database/migrations`) |
| `npm run seed` / `seed:undo` | Sequelize seeders |
| `npm run db:setup` | migrate + seed |
| `npm test` | Jest (in-memory SQLite — no live DB needed) |

## Environment (`.env`)

| Var | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DB_HOST/PORT/USER/PASSWORD/NAME` | docker-compose values | Postgres connection |
| `JWT_SECRET` | — | token signing secret |
| `JWT_EXPIRES_IN` | `1d` | token lifetime |

## API

Base `/api`. Vendor/unit routes require `Authorization: Bearer <token>`.

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| POST | `/auth/login` | `{ username, password }` | `{ token, user }` |
| GET | `/units` | — | `Unit[]` |
| GET | `/vendors` | `?unitId&page&limit` | `{ data, total, page, limit }` |
| POST | `/vendors` | `{ vendorId, name, address, unitId }` | created `Vendor` |
| GET | `/health` | — | `{ status: "ok" }` |

Seeded login: `admin` / `admin123`.

## Structure

```
src/
├── config/        env + Sequelize connection (sqlite in test, postgres otherwise)
├── models/        Unit, User, Vendor + associations
├── controllers/   auth, unit, vendor
├── middleware/    JWT auth guard
├── routes/        route table
├── tests/         Jest specs + seed helper
├── app.ts         Express app factory
└── server.ts      bootstrap
```

## Tests (14)

Auth login success/failure, JWT middleware (no/invalid/valid token), vendor list filtered
by unit, pagination, create + duplicate-`vendorId`/missing-field validation. Each suite
resets an in-memory SQLite DB, so no PostgreSQL is required.

```bash
npm test
```
