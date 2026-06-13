# Siloam Vendor Management

FullStack Web Developer test — a web app to **log in**, view a **per-unit** vendor list,
and **add vendors**, switching between hospital units.

| Layer | Stack | Folder |
|---|---|---|
| Frontend | Vue 3 · Vuetify 3 · Pinia · Vite · TypeScript · Vue Router · Vitest | [`frontend/`](frontend) |
| Backend | ExpressJS · Sequelize · TypeScript · Jest | [`backend/`](backend) |
| Database | PostgreSQL (Sequelize migrations/seeders + raw SQL) | [`database/`](database) |

## Architecture

```
Browser → Vite dev server (:5173)
            └─ /api proxy → Express API (:3000) → PostgreSQL (:5432, Docker)
```

The frontend calls the backend at `/api` (proxied in dev). The backend authenticates
with JWT and serves units/vendors. Vendors are scoped per unit (`vendor_id` is unique
within a unit).

## Prerequisites

- Node.js 18+ (tested on 22)
- Docker (for PostgreSQL)

## Quick start

From the repo root:

```bash
# 1. Start PostgreSQL (auto-loads database/sql/01-schema.sql + 02-seed.sql on first boot)
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run dev          # http://localhost:3000

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Open http://localhost:5173 and log in with:

| Username | Password |
|---|---|
| `admin` | `admin123` |

## Database

The `database/` folder provides **two equivalent** ways to provision the schema + seed:

1. **Raw SQL (default via Docker).** `docker compose up -d` mounts `database/sql/` into the
   Postgres init dir, so `01-schema.sql` and `02-seed.sql` run automatically on first boot.
   To re-run from scratch: `docker compose down && rm -rf .pgdata && docker compose up -d`.

2. **Sequelize migrations + seeders.** Run from `backend/` (where `sequelize-cli` lives;
   `.sequelizerc` points it at `../database/`):

   ```bash
   cd backend
   npm run db:setup     # = migrate + seed
   # or individually: npm run migrate / npm run seed
   ```

Seed data: 3 units (Siloam Lippo Village, Bogor, Makassar), `admin` user, and sample
vendors per unit.

## Tests

```bash
# Backend — Jest (in-memory SQLite, no DB needed)
cd backend && npm test

# Frontend — Vitest (jsdom)
cd frontend && npm test
```

- **Backend (14 tests):** auth login success/failure, JWT middleware, vendor list
  filtered by unit, pagination, create + duplicate/missing-field validation.
- **Frontend (11 tests):** auth & vendor Pinia stores, router guard, VendorView
  (renders rows, opens the New Vendor dialog, refetches on unit change).

## Build (production)

```bash
cd backend  && npm run build   # → dist/
cd frontend && npm run build   # → dist/
```

## API summary

Base `/api`. All vendor/unit routes require `Authorization: Bearer <token>`.

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | `{ username, password }` → `{ token, user }` |
| GET | `/units` | list units |
| GET | `/vendors?unitId=&page=&limit=` | paginated, filtered by unit |
| POST | `/vendors` | `{ vendorId, name, address, unitId }` |
| GET | `/health` | liveness |

## Notes

- The frontend's visual design system (green theme, Instrument Sans, rounded cards, stat
  cards, solid-green active sidebar) is adapted from the internal SSN Middleware admin
  (Metronic/KTUI) and ported to the Vuetify theme.
- Internal planning PRDs live under each folder's `docs/` and are intentionally
  git-ignored (not part of the submission).
