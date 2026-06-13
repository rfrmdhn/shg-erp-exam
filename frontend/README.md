# Frontend — Siloam Vendor Management Web

Vue 3 (Composition API) · Vuetify 3 · Pinia · Vite · TypeScript · Vue Router · Vitest.
UI to log in, view a **per-unit** vendor list, and add/edit/delete vendors.

> Part of the [Siloam Vendor Management](../README.md) monorepo.
> See also: [backend/](../backend/README.md) · [database/](../database/README.md)

## Prerequisites

- Node.js 18+
- The [backend](../backend/README.md) running on `:3000` (the Vite dev server proxies `/api` to it)

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and log in with:

| Username | Password |
|---|---|
| `admin` | `admin123` |

No `.env` file is needed for local development — the Vite dev server automatically
proxies `/api/*` requests to `http://localhost:3000`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR (proxies `/api` → `http://localhost:3000`) |
| `npm run build` | Type-check (`vue-tsc`) + production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Vitest (jsdom) — single run |
| `npm run test:watch` | Vitest in watch mode |

## User flow (matches the test brief)

| Step | Action | Result |
|---|---|---|
| 1 | Open `/login`, enter credentials | Authenticated, redirected to Dashboard |
| 2 | Dashboard loads | Welcome message + unit count stat card |
| 3 | Click **Vendor** in sidebar | Vendor list for the currently selected unit |
| 4 | Change unit via **Branch** dropdown (topbar) | List re-fetches for the new unit |
| 5 | Click **Add Vendor** | Dialog opens with **Vendor ID**, **Vendor Name**, **Address** fields |
| 6 | Submit form | Vendor created, list refreshes |
| 7 | Click edit icon on a row | Dialog opens pre-filled (Vendor ID shown read-only) |
| 8 | Click delete icon on a row | Confirmation dialog → vendor deleted |
| 9 | Click avatar → **Log out** | Token cleared, redirected to `/login` |

## Project structure

```
src/
├── plugins/
│   └── vuetify.ts         Vuetify theme (green primary, Instrument Sans, rounded defaults)
├── styles/
│   └── global.css         global CSS variables and base overrides
├── services/
│   └── api.ts             axios instance with JWT Bearer interceptor + 401 auto-logout
├── stores/
│   ├── auth.ts            Pinia: login, logout, persist token
│   ├── unit.ts            Pinia: fetch units, selected unit
│   └── vendor.ts          Pinia: fetch/create/update/delete vendors, pagination state
├── router/
│   └── index.ts           routes + beforeEach auth guard (unauthenticated → /login)
├── layouts/
│   └── AppShell.vue       sidebar + topbar (unit dropdown, avatar menu, logout)
├── features/
│   ├── auth/              LoginView.vue + useLogin composable
│   ├── dashboard/         DashboardView.vue + useDashboard composable
│   ├── vendors/           VendorView.vue + useVendorTable composable
│   └── branches/          BranchView.vue (unit list management)
├── components/
│   ├── atoms/             AppButton, AppAvatar, AppIconButton
│   ├── molecules/         StatCard, TablePagination, TableEmptyState
│   └── organisms/         DataTableCard, FormDialog, ConfirmDialog
├── types/
│   └── index.ts           shared TypeScript interfaces (Vendor, Unit, User, …)
├── utils/
│   ├── errors.ts          extract user-friendly message from axios errors
│   ├── strings.ts         initials helper
│   └── validators.ts      Vuetify field validator functions
└── test/
    └── setup.ts           Vitest/jsdom global setup (Vuetify, ResizeObserver mock)
```

## Authentication flow

1. `POST /api/v1/auth/login` → JWT token stored in `localStorage`
2. The axios instance in `services/api.ts` reads the token and injects `Authorization: Bearer <token>` on every request
3. On 401 response the interceptor clears the token and redirects to `/login`
4. The Vue Router guard (`router/index.ts`) blocks access to protected routes if no token is present

## Design system

The visual language is adapted from an internal admin dashboard (**Metronic/KTUI** +
Tailwind): **green primary `#16a34a`**, Instrument Sans typography, `rounded-lg` card
corners, soft shadows, tinted-icon stat cards, and a solid-green active pill in the
sidebar. Everything is configured in
[`src/plugins/vuetify.ts`](src/plugins/vuetify.ts) and
[`src/styles/global.css`](src/styles/global.css).

## Tests (24)

All tests run in jsdom — no browser or backend needed.

```bash
npm test
```

Coverage:

- **`stores/auth.test.ts` (5):** login stores token and user, login failure, logout clears state, persisted token restores session
- **`stores/unit.test.ts` (8):** fetch units, setSelectedUnit, error state, loading flag
- **`stores/vendor.test.ts` (4):** fetchVendors populates list + pagination, createVendor posts + refetches, error state, re-throws on failure
- **`router/router.test.ts` (4):** unauthenticated → redirect to `/login`, authenticated on `/login` → redirect to `/dashboard`, protected route allowed when logged in, redirect query param preserved
- **`features/vendors/VendorView.test.ts` (3):** renders vendor rows from store, New Vendor dialog shows all three required fields (Vendor ID / Name / Address), refetches when selected unit changes
