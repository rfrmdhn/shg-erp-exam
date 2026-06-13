# Frontend — Siloam Vendor Management Web

Vue 3 (Composition API) · Vuetify 3 · Pinia · Vite · TypeScript · Vue Router · Vitest.
UI to log in, view a **per-unit** vendor list, and add vendors.

> Part of the [Siloam Vendor Management](../README.md) monorepo.
> See also: [backend/](../backend/README.md) · [database/](../database/README.md)

## Prerequisites

- Node.js 18+
- The [backend](../backend/README.md) running on `:3000` (the dev server proxies `/api` to it)

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

Open http://localhost:5173 and log in with `admin` / `admin123`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server (proxies `/api` → `http://localhost:3000`) |
| `npm run build` | Type-check (`vue-tsc`) + production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Vitest (jsdom) |
| `npm run test:watch` | Vitest in watch mode |

## User flow (per the test brief)

1. Login → welcome **Dashboard**.
2. **Vendor** menu → vendor list for the selected unit.
3. **New Vendor** button → dialog with Vendor Id / Vendor Name / Address.
4. **Unit** dropdown (topbar) → switches the list between units.

## Design system

The visual language is adapted from the internal **SSN Middleware** admin (Metronic/KTUI +
Tailwind): **green primary (`#16a34a`)**, Instrument Sans typography, `rounded-lg` corners,
soft shadows, tinted-icon stat cards, and a sidebar whose active item is a solid-green pill.
Ported to Vuetify in [`src/plugins/vuetify.ts`](src/plugins/vuetify.ts) +
[`src/styles/global.css`](src/styles/global.css).

## Structure

```
src/
├── plugins/vuetify.ts   theme + Vuetify defaults
├── services/api.ts      axios instance + JWT interceptor
├── stores/              Pinia: auth, unit, vendor
├── router/              routes + auth guard
├── layouts/AppShell.vue sidebar + topbar (unit dropdown)
├── views/               LoginView, DashboardView, VendorView
├── types/               shared TS types
└── test/setup.ts        Vitest/jsdom setup
```

## Config

The dev server proxies `/api` to the backend (see [`vite.config.ts`](vite.config.ts)); no
`.env` is required locally. For a non-proxied deployment, point the axios `baseURL` in
[`src/services/api.ts`](src/services/api.ts) at your API origin.

## Tests (11)

auth & vendor Pinia stores, router guard (redirects unauthenticated → `/login`), and
VendorView (renders rows, opens the New Vendor dialog, refetches on unit change).

```bash
npm test
```
