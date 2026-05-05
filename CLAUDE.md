# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Campo no Campus** is a Next.js 15 web platform for order management and payment in a solidarity economy group (Grupo de Consumo) connecting IFAL (Federal Institute of Alagoas) civil servants with family farmers from Viçosa, Alagoas, Brazil. UI text and comments are in Brazilian Portuguese.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # ESLint via Next.js
npm run typecheck  # TypeScript check (tsc --noEmit)
```

No test suite is configured.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Architecture

### Stack
- **Framework:** Next.js 15 App Router with React 19 Server Components
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Storage:** Supabase Storage (`product-images` and `payment-proofs` buckets)
- **Styling:** Custom CSS (no UI framework)

### Key Directories

- `app/` — Next.js pages using App Router. Pages are Server Components by default; client components are colocated when needed.
- `components/` — Reusable React components (cart, product cards, admin forms, modals).
- `lib/` — All business logic and data access:
  - `auth.ts` — Auth helpers: `getCurrentUser`, `getCurrentProfile`, `requireAuth`, `requireRole`
  - `data.ts` — Read-only database queries (products, orders, reports)
  - `actions.ts` — Server Actions for all mutations (create/update/delete products and orders, CSV export)
  - `types.ts` — TypeScript interfaces shared across the app
  - `utils.ts` — Formatting helpers (currency, dates)
  - `supabase/client.ts` — Browser Supabase client
  - `supabase/server.ts` — Server-side Supabase client (uses cookies)
- `supabase/migrations/` — Version-controlled SQL migrations
- `middleware.ts` — Supabase SSR middleware that refreshes auth cookies on every request

### Database Schema

Core tables:
- `profiles` — Extends Supabase auth, stores `role` (customer | admin); auto-created via trigger on signup
- `products` — Catalog with name, price, unit, category, active flag, optional `image_path`
- `orders` — Orders with status (pending | paid | cancelled), payment proof path
- `order_items` — Line items with denormalized product name, unit price, and line total

Row-Level Security (RLS) is enabled: customers see only their own data; admins have full access.

### Routing

| Route | Purpose |
|-------|---------|
| `/` | Public product catalog grouped by category |
| `/login` | Supabase email auth |
| `/checkout` | Cart review + payment proof upload + order submission |
| `/cliente` | Customer order history |
| `/perfil` | Profile settings |
| `/pedido/[id]` | Order detail |
| `/admin` | Admin dashboard with stats |
| `/admin/produtos` | Product CRUD |
| `/admin/pedidos` | Order management + payment proof viewer |
| `/admin/relatorios` | Weekly sales reports with CSV export |

### Cart State

Cart is client-side only, managed via React Context API and persisted to `localStorage`. On checkout, the cart contents are sent to a Server Action that creates the order and order items in a single transaction.

### Adding Features

- **New database columns:** add a migration in `supabase/migrations/`, update `lib/types.ts`, update queries in `lib/data.ts` and mutations in `lib/actions.ts`.
- **New pages:** create under `app/`; use `requireAuth` / `requireRole` from `lib/auth.ts` at the top of page components to protect routes.
- **Server mutations:** implement as Server Actions in `lib/actions.ts` and call them from client or server components.
