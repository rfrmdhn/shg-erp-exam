# Backend — Siloam Vendor Management API

ExpressJS · Sequelize · TypeScript · Jest. Authenticates users (JWT) and serves a
**per-unit** vendor list with full CRUD.

> Part of the [Siloam Vendor Management](../README.md) monorepo.
> See also: [frontend/](../frontend/README.md) · [database/](../database/README.md)

## Prerequisites

- Node.js 18+
- A running PostgreSQL — start it with `docker compose up -d` from the repo root
  (see [database/README.md](../database/README.md))

## Setup

```bash
cp .env.example .env      # values already match docker-compose defaults — no edits needed
npm install
npm run dev               # http://localhost:3000
```

> The Docker Compose PostgreSQL auto-loads the schema + seed on first boot, so no
> manual migration step is needed. If you prefer Sequelize CLI: `npm run db:setup`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with hot reload (ts-node-dev) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run the compiled server (requires `npm run build` first) |
| `npm run migrate` | Run Sequelize migrations (against `../database/migrations`) |
| `npm run migrate:undo` | Roll back the last migration |
| `npm run seed` | Run Sequelize seeders |
| `npm run seed:undo` | Roll back seeders |
| `npm run db:setup` | Shortcut: migrate + seed |
| `npm test` | Jest — in-memory SQLite, no live DB required |

## Environment (`.env`)

Copy `.env.example` to `.env`. The defaults already match `docker-compose.yml`.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP port the server listens on |
| `NODE_ENV` | `development` | `test` switches Sequelize to in-memory SQLite |
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5433` | Host-side port (docker-compose maps `5433 → 5432` inside the container) |
| `DB_USER` | `siloam` | Postgres username |
| `DB_PASSWORD` | `siloam` | Postgres password |
| `DB_NAME` | `siloam_vendor` | Postgres database name |
| `JWT_SECRET` | `change-me-in-production` | Secret used to sign tokens — change in production |
| `JWT_EXPIRES_IN` | `1d` | Token lifetime |

## API

Base path: `/api/v1`. All vendor/unit endpoints require `Authorization: Bearer <token>`.

### Authentication

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/v1/auth/login` | `{ username, password }` | `{ token, user }` |

Seeded credentials: **username** `admin` · **password** `admin123`

### Units

| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/api/v1/units` | Required | `Unit[]` |

### Vendors

| Method | Path | Auth | Query / Body | Returns |
|---|---|---|---|---|
| GET | `/api/v1/vendors` | Required | `?unitId&page&limit` | `{ data, total, page, limit }` |
| POST | `/api/v1/vendors` | Required | `{ vendorId, name, address, unitId }` | created `Vendor` (201) |
| PUT | `/api/v1/vendors/:id` | Required | `{ name, address }` | updated `Vendor` |
| DELETE | `/api/v1/vendors/:id` | Required | — | 204 No Content |

**Vendor ID rules:** `vendorId` must be unique within the same unit. The same `vendorId`
may exist across different units. Duplicate returns `409 Conflict`.

### Liveness

| Method | Path | Returns |
|---|---|---|
| GET | `/api/v1/health` | `{ status: "ok" }` |

## Project structure

```
src/
├── config/        env validation + Sequelize connection (SQLite in test, Postgres otherwise)
├── constants/     shared string constants (error messages)
├── controllers/   auth, unit, vendor — thin HTTP layer
├── errors/        AppError class (carries HTTP status code)
├── middleware/    JWT auth guard, Zod validation middleware
├── models/        Unit, User, Vendor Sequelize models + associations
├── routes/        route table wiring controllers to paths
├── schemas/       Zod request validation schemas (auth, unit, vendor)
├── services/      business logic: auth, unit, vendor
├── tests/         Jest specs (auth, unit, vendor, middleware) + seed helper
├── types/         shared TypeScript interfaces (AuthRequest, CreateVendorData, …)
├── utils/         request helpers (parseId, parsePagination)
├── app.ts         Express app factory (middleware + routes + error handler)
└── server.ts      bootstrap (creates app, starts HTTP server)
```

## Tests (34)

All tests run against an in-memory SQLite database — no PostgreSQL required.

```bash
npm test
```

Coverage:
- **Auth (5):** login success, wrong password, missing fields, JWT guard (no token / invalid token / valid token)
- **Units (4):** list units requires auth, returns seeded data
- **Vendor list (4):** requires `unitId`, filters by unit, paginates, handles DB errors
- **Vendor create (5):** creates with user-supplied ID, rejects duplicate `vendorId` in same unit (409), allows same ID in different unit, rejects missing fields (400), handles DB errors
- **Vendor update (2):** updates name/address, 404 for missing ID
- **Vendor delete (2):** deletes, 404 for missing ID
- **Middleware (12):** auth guard edge cases, Zod validation middleware with various schema shapes
