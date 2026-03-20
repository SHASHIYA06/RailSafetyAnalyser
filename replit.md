# KMRCL DLP Store Inventory Management System

## Overview

A comprehensive **Depot Level Parts (DLP) Store Inventory Management System** for Kolkata Metro Rail Corporation Ltd. (KMRCL). Built for metro rail depot operations — tracking parts, tools, vendors, train systems, and stock movements. Includes integrated Railway RAMS analysis module.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom railway-themed color palette
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Design**: RESTful API with structured error handling

### Project Structure
```
├── client/          # Frontend React application
│   └── src/
│       ├── pages/   # All page components
│       ├── components/  # Shared components (Layout, KhushiAgent)
│       └── lib/     # Auth helpers, query client
├── server/          # Backend Express.js server
├── shared/          # Shared types and schemas
└── migrations/      # Database migration files
```

## Authentication

- **Admin Passcode**: `9799494321` (hardcoded, always works)
- **Firebase Auth**: email/password login (optional — only shown if `VITE_FIREBASE_*` env vars are set)
- Auth stored in localStorage (`dlp_auth=true`, `dlp_role`, `dlp_user`)
- All routes protected with auth guard — redirect to `/login` when not authenticated
- Logout button in sidebar (clears localStorage, redirects to login)
- `client/src/lib/auth.ts` — `isAuthenticated()`, `logout()`, `getUser()`

## Key Features

### DLP Inventory Management
1. **Dashboard** (`/`) — KMRCL hero banner, system stock health bars, active alerts, recent transactions, vendor summary
2. **DLP Inventory** (`/inventory`) — 20 DLP items with real-time stock tracking, search/filter, detail modal
3. **Tools** (`/tools`) — 39+ tools with category, condition, calibration tracking
4. **Vendors** (`/vendors`) — 10 certified suppliers (India/Germany/France) with ratings
5. **Train Systems** (`/systems`) — 14 metro subsystems with stock consumption rates
6. **Transactions** (`/transactions`) — Full audit trail of receipts, issues, returns, transfers
7. **New Transaction** (`/issue`) — Issue/Receipt/Return form with item search + audit trail
8. **Reports & Analytics** (`/reports`) — Recharts dashboards, category charts, low-stock table, CSV export
9. **Item Manager** (`/item-manager`) — Full CRUD (Add/Edit/Delete) for inventory items
10. **Alerts** (`/alerts`) — Active alerts management with resolve/dismiss functionality

### RAMS Module (retained)
- Standards Library (30+ EN standards)
- RAMS Analysis and compliance scoring
- AI Search (Khushi AI powered by OpenRouter Claude)
- Drive Documents integration
- Rail News feed

## Data Models (DLP-specific)

| Table | Records | Description |
|-------|---------|-------------|
| `dlp_vendors` | 10 | Certified supplier master |
| `dlp_systems` | 14 | Metro train subsystems |
| `dlp_items` | 20 | DLP parts inventory |
| `dlp_tools` | 39 | Workshop tools & equipment |
| `dlp_transactions` | 8 | Stock movement log |
| `dlp_alerts` | 4 | Active stock alerts |

## API Endpoints

### DLP APIs
- `GET /api/dlp/stats` — Dashboard statistics
- `GET /api/dlp/items` — DLP inventory with search/filter
- `GET /api/dlp/items/:id` — Single item detail
- `POST /api/dlp/items` — Add new inventory item
- `PATCH /api/dlp/items/:id` — Update inventory item
- `DELETE /api/dlp/items/:id` — Delete inventory item
- `GET /api/dlp/tools` — Tools inventory
- `GET /api/dlp/vendors` — Vendor master list
- `GET /api/dlp/systems` — Train systems breakdown
- `GET /api/dlp/transactions` — Transaction log
- `POST /api/dlp/transactions` — Create new transaction
- `GET /api/dlp/alerts` — Active alerts
- `PATCH /api/dlp/alerts/:id/resolve` — Resolve alert

## External Integrations

- **OpenRouter** (Claude 3 Haiku): AI search via Khushi agent
- **Google Drive**: Document sync (Folder ID: 1O444fl8fyyf8B0LtVm99FLYvjBtx_TU0)
- **Neon PostgreSQL**: Serverless database

## Deployment

### Development
- `npm run dev` — starts Express + Vite on port 5000
- `npm run db:push` — push schema changes to Neon DB
- Re-seed: `npx tsx -e "import { seedDlpData } from './server/dlp-seed.ts'; seedDlpData()"`

### GitHub
- `.gitignore` configured (excludes node_modules, dist, .env, .replit, migrations, attached_assets)
- Copy `.env.example` to `.env` and fill in real values before deploying

### Vercel Deployment
- `vercel.json` configured with build command, rewrites, and CORS headers
- `api/index.ts` is the serverless entry point (wraps Express routes)
- Set environment variables in Vercel dashboard: `DATABASE_URL`, `OPENROUTER_API_KEY`, Firebase vars
- `npm run build` output goes to `dist/public` (Vite static) + `dist/index.js` (Express)

### Firebase Authentication (Optional)
- Set `VITE_FIREBASE_*` env vars to enable Firebase Auth (see `.env.example`)
- Without Firebase vars: login shows passcode-only mode
- With Firebase vars: dual-mode (passcode admin + Firebase email/password)
- `client/src/lib/firebase.ts` handles all Firebase SDK initialization

## Changelog

```
- March 20, 2026: Full KMRCL DLP Store system built — login, dashboard, inventory (20 items), tools (39), vendors (10), systems (14), transactions, alerts; OpenRouter AI integration; auth guard
- July 06, 2025: Initial Railway RAMS setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Admin passcode: 9799494321
```
