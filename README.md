# College Platform Full Project

This workspace contains two projects:

- `college-platform-backend` — Node.js + Express + TypeScript + Prisma backend
- `college-platform-frontend` — Next.js 14 + Tailwind frontend

## Deployment Overview

### Backend (Railway)

1. Push `college-platform-backend` to GitHub.
2. Create a Railway project and link the repository.
3. Add a PostgreSQL database on Railway.
4. Set Railway environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT=5000`
   - `CORS_ORIGIN=https://<vercel-frontend-url>`
5. Initialize schema on Railway PostgreSQL:
   - First deploy: `npm run db:push`
   - Later schema changes with migrations: `npm run db:deploy`
6. Seed sample data:
   - `npm run db:seed`
7. Verify the API:
   - `GET https://<railway-url>/colleges`

### Frontend (Vercel)

1. Push `college-platform-frontend` to GitHub.
2. Create a Vercel project and import the repo.
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://<railway-backend-url>`
4. Deploy the Vercel project.
5. Verify the app loads and all pages work.

## Testing Endpoints

- `GET /colleges`
- `GET /colleges/:id`
- `POST /colleges/compare` with `{ "ids": [1,2] }`
- `POST /auth/register`
- `POST /auth/login`
- `POST /save` (authenticated)

## Local Run Commands

### Backend

```bash
cd "c:\New folder\college-platform-backend"
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### Frontend

```bash
cd "c:\New folder\college-platform-frontend"
npm install
npm run dev
```
