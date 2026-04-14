# 🏦 TradePro — Complete Trading Platform

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env → set your PostgreSQL DATABASE_URL

# 3. Setup database
npx prisma generate
npx prisma db push

# 4. Run
npm run dev
```

Open http://localhost:3000

> **Note:** If you don't have PostgreSQL, the WebTrader (`/trader`) and public pages work WITHOUT a database — only auth/client-area needs it.

## Routes (32 pages)

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/trader` | **WebTrader** — 39 instruments, live trading, demo $100K |
| `/client-area/dashboard` | Client Portal |
| `/admin` | Admin Panel |
| `/auth/login` | Login |
| `/auth/register` | 3-step Registration |
| `/forex` `/crypto` `/stocks` `/indices` `/metals` `/commodities` | Market pages |
| `/trading-accounts` | 5-tier account comparison |
| `/cfds-list` | Full instruments table |
| `/education` | Education Center |

## Tech Stack
- Next.js 14 + TypeScript + Tailwind CSS
- PostgreSQL + Prisma 5 (25 tables)
- TradingView Lightweight Charts
- Zustand (state management)
- Custom JWT auth (bcrypt + httpOnly cookies)
