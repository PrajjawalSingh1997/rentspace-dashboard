# RentLyf Super Admin Dashboard

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** TailwindCSS v4 + Shadcn/UI
- **Data Fetching:** TanStack React Query + Axios
- **State Management:** Zustand
- **Forms & Validation:** React Hook Form + Zod
- **Charts:** Recharts

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure
- `src/app/` — Next.js App Router (pages & layouts)
  - `(dashboard)/` — Protected layouts containing the Sidebar and Header
  - `(auth)/` — Public layout for Login
- `src/config/` — Global configurations and routing constants
- `src/features/` — Domain-driven localized modules
  - `auth/` — Centralized Auth logic (components, api, stores like `useAuthStore`)
  - `properties/` — Centralized Property logic
- `src/components/ui/` — Globally shared Shadcn generic UI components
- `src/lib/` — Global Utilities and Axios client
- `src/types/` — Shared TypeScript interfaces matching Prisma schema

## Design System
This dashboard strictly implements the **TailAdmin Light Theme** combined with RentLyf's **Stitch Design System**:
- **Primary Brand:** Deep Teal Green (`#084734`)
- **Secondary Brand:** Lime Mist (`#CEF17B`)
- **Neutrals:** Gray Scale (`#111827` to `#F3F4F6`)
- **Property Colors:** Fixed palette for Apartment (Purple), Commercial (Pink), PG (Teal), and Hostel (Blue).

All colors, border-radii, and spacing tokens are mapped natively into Tailwind v4's `globals.css` `@theme` configurations.

## Implementation Status

### Phase 0: Setup & Shell (✅ Complete)
- Next.js 16 App Router configuration
- Tailwind v4 & Shadcn setup
- Global CSS & Theme variables
- Axios & TanStack Query configuration
- Auth Zustand store
- `(auth)` layout with centered fluid-responsive forms
- `(dashboard)` layout with:
  - Fixed Sidebar with TailAdmin aesthetics
  - Fixed Header with tinted search bar
  - Zero-scrollbar `h-screen` content wrapper
- Global `RentSpace` → `RentLyf` brand rename
- Developer bypass login button integrated
