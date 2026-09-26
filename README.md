# ExpenseFlow — Full-Stack Expense Tracker

A production-ready expense tracker built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **Drizzle ORM** (Postgres), and **Clerk** authentication.

## Features

- 🔐 Auth via Clerk (email, social login, magic links — whatever you enable in your Clerk dashboard)
- 💸 Add / edit / delete expenses with title, amount, category, date, notes
- 🏷️ Per-user categories, seeded with sensible defaults on first login
- 📊 Dashboard with summary cards + a category breakdown pie chart (Recharts)
- 🔎 Filter expenses by category
- 🔒 Every API route is scoped to the signed-in user (`userId` from Clerk) — users can only ever see/edit their own data
- 📱 Responsive, Tailwind-based UI

## Tech Stack

| Layer      | Tech                                  |
|------------|----------------------------------------|
| Framework  | Next.js 14 (App Router, Server Components + Route Handlers) |
| UI         | React 18, Tailwind CSS, lucide-react icons, Recharts |
| Auth       | Clerk (`@clerk/nextjs`)               |
| Database   | Postgres + Drizzle ORM (`drizzle-orm`, `postgres`) |
| Validation | Zod                                    |

---

## 1. Prerequisites

- Node.js 18.18+ (Node 20 recommended)
- A Postgres database — easiest options:
  - [Neon](https://neon.tech) (serverless Postgres, generous free tier)
  - [Supabase](https://supabase.com)
  - [Railway](https://railway.app)
- A free [Clerk](https://clerk.com) account/application

---

## 2. Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your keys
cp .env.example .env.local
```

Edit `.env.local`:

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

Where to get each value:
- **DATABASE_URL** — from your Postgres provider's connection-string page (Neon: Dashboard → your project → "Connection string", use the *pooled* connection string).
- **Clerk keys** — [dashboard.clerk.com](https://dashboard.clerk.com) → create an application → **API Keys** page.

### Run the database migration

This project already includes a generated migration in `/drizzle`. Just apply it to your database:

```bash
npm run db:migrate
```

(If you ever change `src/db/schema.ts`, run `npm run db:generate` first to create a new migration, then `npm run db:migrate` again.)

### Start the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/sign-in`. Create an account; default categories (Food, Transportation, Shopping, etc.) are created automatically the first time you load the dashboard.

---

## 3. Deploying to Vercel (recommended)

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add the same environment variables from `.env.local` in the Vercel project's **Settings → Environment Variables**.
4. Deploy.
5. Run the migration against your **production** database once, either:
   - Locally: temporarily point `DATABASE_URL` in `.env.local` at production and run `npm run db:migrate`, or
   - From Neon/Supabase's built-in SQL editor by pasting the contents of `drizzle/0000_legal_sauron.sql`.
6. In your Clerk dashboard, add your Vercel production URL under **Domains** so auth redirects work in production.

Any other Node host (Railway, Render, Fly.io) works the same way — just set the env vars and run `npm run build && npm start`.

---

## 4. Project Structure

```
src/
  app/
    page.tsx                 # Dashboard (protected)
    layout.tsx                # Root layout + ClerkProvider + header
    sign-in/[[...sign-in]]/   # Clerk sign-in page
    sign-up/[[...sign-up]]/   # Clerk sign-up page
    api/
      expenses/               # GET (list+filter), POST (create)
      expenses/[id]/          # PATCH, DELETE
      categories/              # GET (list, auto-seeds defaults), POST
      categories/[id]/         # PATCH, DELETE
  components/
    Dashboard.tsx             # Client-side page orchestrator
    SummaryCards.tsx
    CategoryChart.tsx          # Recharts pie chart
    ExpenseForm.tsx            # Add/edit modal
    ExpenseList.tsx
  db/
    schema.ts                 # Drizzle schema (categories, expenses)
    index.ts                  # DB client
    migrate.ts                # Migration runner script
    seed.ts                   # Optional demo-data seeder
  lib/
    categories.ts              # Ensures default categories per user
    icon-map.ts
    types.ts
    utils.ts
  middleware.ts                # Clerk route protection
drizzle/                       # Generated SQL migrations
```

## 5. Notes on Security

- All API routes call `auth()` from Clerk and reject unauthenticated requests with `401`.
- Every database query is filtered by the authenticated `userId`, so one user can never read or modify another user's data — including on update/delete, which also check ownership.
- `middleware.ts` protects every route except `/sign-in` and `/sign-up`.

## 6. Possible Extensions

- Monthly trend bar chart (data already supports grouping by `expenseDate`)
- CSV export
- Budgets per category with progress bars
- Recurring expenses
