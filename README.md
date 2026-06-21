# 🐎 Equine Management System (马匹管理系统)

A comprehensive management platform for horse farms, training centers, and individual horse owners. Track health, farrier visits, training, competitions, feeding, and finances for multiple horses.

## ✨ Features

- **Horse Profiles** — chip ID, pedigree, ownership, photos, status
- **Health Management** — vet records, vaccinations (with auto-reminders), deworming, injuries
- **Farrier Schedule** — recurring trim/shoe cycles (default 6–8 weeks)
- **Training & Competition** — training logs, competition planning, results, season stats
- **Feeding** — diet plans, consumption, body condition score (BCS) tracking
- **Finance** *(optional)* — per-horse expenses & income
- **Reminders & Calendar** — unified calendar (vaccines, farrier, vet, competitions)
- **Dashboard** — KPI cards, upcoming events, cost trends
- **Users & Roles** — admin / owner / vet / farrier / rider / viewer
- **i18n** (中文 / English) & **Dark mode**

## 🧱 Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript + Prisma ORM |
| Database | PostgreSQL (SQLite for dev) |
| Auth | JWT + bcrypt |
| API Docs | Swagger / OpenAPI |
| Container | Docker + docker-compose |

## 🚀 Quick Start

### Option A — Docker (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs
- Postgres: localhost:5432

### Option B — Local dev

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Default login:** `admin@equine.local` / `admin123`

## 📁 Project Structure

```
project/
├── backend/              Express + Prisma API
│   ├── prisma/           Schema, migrations, seed
│   ├── src/
│   │   ├── modules/      Feature modules (horses, health, farrier, ...)
│   │   ├── middleware/   Auth, error handler, validation
│   │   ├── lib/          Prisma client, logger
│   │   └── index.ts      App entry
│   └── package.json
├── frontend/             React + Vite SPA
│   ├── src/
│   │   ├── pages/        Dashboard, Horses, Calendar, ...
│   │   ├── components/   UI building blocks
│   │   ├── i18n/         zh / en locales
│   │   └── main.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🗄️ Database Schema (overview)

See [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) for the canonical source. Tables:

`users`, `owners`, `horses`, `veterinary_records`, `vaccinations`, `deworming_records`, `farrier_records`, `training_logs`, `competitions`, `competition_results`, `feeding_plans`, `expenses`, `reminders`, `attachments`.

Every table has `id`, `created_at`, `updated_at` and proper foreign-key relations.

## 🛣️ Roadmap (development order)

1. ✅ DB schema + backend skeleton
2. ✅ Auth (JWT)
3. ✅ Horse CRUD
4. ✅ Health module (vet / vaccine / deworming)
5. ✅ Farrier + reminders
6. ✅ Training & competition
7. ✅ Dashboard
8. ⬜ Feeding & finance UIs
9. ⬜ Multi-user role UI
10. ⬜ Deployment polish & tests

## 📜 License

MIT
