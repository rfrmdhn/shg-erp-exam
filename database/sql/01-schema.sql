-- Siloam Vendor Management — schema (PostgreSQL)
-- Equivalent to the Sequelize migrations in ../migrations.

CREATE TABLE IF NOT EXISTS units (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'admin',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendors (
    id          SERIAL PRIMARY KEY,
    vendor_id   VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(255) NOT NULL,
    unit_id     INTEGER      NOT NULL REFERENCES units(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT vendors_vendor_id_unit_id_unique UNIQUE (vendor_id, unit_id)
);
