# Database — Siloam Vendor Management

PostgreSQL schema + seed data. Provided in **two equivalent forms** (per the test brief:
"migration or all query that needed by the application to run").

> Part of the [Siloam Vendor Management](../README.md) monorepo.
> See also: [backend/](../backend/README.md) · [frontend/](../frontend/README.md)

## Two ways to provision

### 1. Raw SQL (default, via Docker)

The root [`docker-compose.yml`](../docker-compose.yml) mounts [`sql/`](sql) into the Postgres
init directory, so on **first boot** it runs:

1. [`sql/01-schema.sql`](sql/01-schema.sql) — tables + constraints
2. [`sql/02-seed.sql`](sql/02-seed.sql) — units, admin user, sample vendors

```bash
# from repo root
docker compose up -d
# re-run from scratch:
docker compose down && rm -rf .pgdata && docker compose up -d
```

These `.sql` files also run standalone against any PostgreSQL:

```bash
psql "$DATABASE_URL" -f sql/01-schema.sql -f sql/02-seed.sql
```

### 2. Sequelize migrations + seeders

Run from [`backend/`](../backend/README.md) (that's where `sequelize-cli` is installed;
`backend/.sequelizerc` points it here, and [`config/config.js`](config/config.js) reads the
backend `.env`):

```bash
cd ../backend
npm run db:setup        # migrate + seed
# or: npm run migrate / npm run seed (and *:undo to roll back)
```

## Schema

| Table | Columns | Notes |
|---|---|---|
| `units` | `id`, `name` | unique name |
| `users` | `id`, `username`, `password_hash`, `name`, `role` | unique username |
| `vendors` | `id`, `vendor_id`, `name`, `address`, `unit_id` | FK → `units`; **unique `(vendor_id, unit_id)`** |

Relationship: `units 1 ──< vendors` (cascade on delete). The same `vendor_id` may exist in
different units but not twice within one unit.

## Seed data

- **units:** Siloam Lippo Village, Siloam Bogor, Siloam Makassar
- **users:** `admin` / `admin123` (bcrypt-hashed)
- **vendors:** sample rows per unit

## Layout

```
database/
├── sql/            raw schema.sql + seed.sql (Docker init, or run with psql)
├── migrations/     Sequelize migrations (units, users, vendors)
├── seeders/        Sequelize seeders (units, users, vendors)
└── config/         Sequelize CLI config (reads backend .env)
```

> Keep the two forms in sync — they describe the same schema and seed.
