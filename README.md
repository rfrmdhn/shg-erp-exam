# Siloam Vendor Management

FullStack Web Developer technical test — a web app to **log in**, view a **per-unit**
vendor list, and add vendors, switching between hospital units.

| Layer | Stack | Folder |
|---|---|---|
| Frontend | Vue 3 · Vuetify 3 · Pinia · Vite · TypeScript · Vue Router · Vitest | [`frontend/`](frontend/README.md) |
| Backend | ExpressJS · Sequelize · TypeScript · Jest | [`backend/`](backend/README.md) |
| Database | PostgreSQL (Sequelize migrations/seeders + raw SQL) | [`database/`](database/README.md) |

## Architecture

```
Browser
  └─ Vite dev server  :5173
       └─ /api/*  proxy
            └─ Express API  :3000
                 └─ PostgreSQL  localhost:5433  (Docker: host 5433 → container 5432)
```

The frontend never calls the backend directly — the Vite dev proxy forwards every
`/api/*` request to Express. The backend authenticates with JWT and scopes vendors per
unit (`vendor_id` is unique within a unit, but may repeat across units).

## Ports

| Service | Local URL | Notes |
|---|---|---|
| Frontend (Vite) | http://localhost:5173 | Vite dev server with HMR |
| Backend (Express) | http://localhost:3000 | REST API |
| PostgreSQL | localhost:**5433** | Docker host port (container internal: 5432) |

## Prerequisites

- **Node.js 18+** (tested on 22)
- **Docker** (for PostgreSQL — no local Postgres install required)

## Quick start

Run these commands from the **repo root**:

```bash
# 1. Start PostgreSQL
#    First boot: auto-runs database/sql/01-schema.sql then 02-seed.sql
docker compose up -d

# 2. Backend  (new terminal)
cd backend
cp .env.example .env       # defaults already match docker-compose — no edits needed
npm install
npm run dev                # API ready at http://localhost:3000

# 3. Frontend  (another terminal)
cd frontend
npm install
npm run dev                # App ready at http://localhost:5173
```

Open **http://localhost:5173** and log in:

| Username | Password |
|---|---|
| `admin` | `admin123` |

## Feature walkthrough

| Step | What to do | Expected result |
|---|---|---|
| Login | Enter `admin` / `admin123` | Redirected to Dashboard with welcome message |
| Vendor list | Click **Vendor** in the sidebar | Paginated table of vendors for the selected unit |
| Switch unit | Open **Branch** dropdown in the topbar | List immediately re-fetches for the chosen unit |
| Add vendor | Click **Add Vendor** → fill in Vendor ID, Name, Address → Save | New row appears in the table |
| Edit vendor | Click the pencil icon on any row | Dialog pre-filled with Name and Address (Vendor ID is read-only) |
| Delete vendor | Click the trash icon → confirm | Row removed |
| Logout | Click avatar → **Log out** | Redirected to `/login` |

## Database

The `database/` folder contains **two equivalent** ways to provision the schema + seed
(per the brief: *"migration or all query that needed by the application to run"*):

### Option A — Raw SQL via Docker (default)

`docker compose up -d` mounts `database/sql/` into the Postgres init directory.
On **first boot** it automatically runs:

1. [`database/sql/01-schema.sql`](database/sql/01-schema.sql) — creates tables + constraints
2. [`database/sql/02-seed.sql`](database/sql/02-seed.sql) — inserts units, admin user, sample vendors

To wipe and re-seed from scratch:

```bash
docker compose down
rm -rf .pgdata
docker compose up -d
```

### Option B — Sequelize CLI

Run from `backend/` (where `sequelize-cli` is installed; `backend/.sequelizerc` points it
at `../database/`):

```bash
cd backend
npm run db:setup     # runs migrations then seeders
```

Roll back with `npm run migrate:undo` / `npm run seed:undo`.

### Seed data

| Table | Records |
|---|---|
| `units` | Siloam Lippo Village · Siloam Bogor · Siloam Makassar |
| `users` | `admin` / `admin123` |
| `vendors` | 4 rows under Lippo Village, 2 under Bogor, 1 under Makassar |

## Tests

Both test suites run without a live database.

```bash
# Backend — Jest, in-memory SQLite
cd backend && npm test

# Frontend — Vitest, jsdom
cd frontend && npm test
```

| Suite | Count | Covers |
|---|---|---|
| Backend | **34** | auth (login/fail/JWT guard), unit list, vendor CRUD (create with user ID, duplicate 409, cross-unit same ID, pagination, update, delete), middleware validation |
| Frontend | **24** | auth/unit/vendor Pinia stores, router auth guard, VendorView (renders rows, all three form fields present, refetches on unit change) |

## Build

```bash
cd backend  && npm run build   # TypeScript → dist/
cd frontend && npm run build   # vue-tsc type-check + Vite bundle → dist/
```

## API reference

Base: `/api/v1`. All vendor/unit endpoints require `Authorization: Bearer <token>`.

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| POST | `/api/v1/auth/login` | `{ username, password }` | `{ token, user }` |
| GET | `/api/v1/units` | — | `Unit[]` |
| GET | `/api/v1/vendors` | `?unitId=&page=&limit=` | `{ data, total, page, limit }` |
| POST | `/api/v1/vendors` | `{ vendorId, name, address, unitId }` | created `Vendor` (201) |
| PUT | `/api/v1/vendors/:id` | `{ name, address }` | updated `Vendor` |
| DELETE | `/api/v1/vendors/:id` | — | 204 No Content |
| GET | `/api/v1/health` | — | `{ status: "ok" }` |

`vendorId` must be unique per unit — duplicate returns `409 Conflict`.

## Troubleshooting

**Cannot connect to database**
The Docker Postgres is exposed on host port **5433**, not 5432. Confirm `DB_PORT=5433`
in `backend/.env` (the `.env.example` already has this value).

**`docker compose up -d` says port already in use**
Another Postgres instance is running on 5433. Either stop it or change the host port
in `docker-compose.yml` and `backend/.env`.

**Schema/seed not loaded after `docker compose up -d`**
The init SQL only runs on the **first boot** (when `.pgdata/` is empty). To force a
re-run: `docker compose down && rm -rf .pgdata && docker compose up -d`.

**Frontend shows "Failed to load vendors"**
Make sure the backend is running (`npm run dev` in `backend/`) before opening the
frontend.

**Tests fail with `Cannot find module ...`**
Run `npm install` inside the relevant folder (`backend/` or `frontend/`).
