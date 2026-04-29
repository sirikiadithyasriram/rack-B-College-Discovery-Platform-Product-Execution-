# College Platform Backend

Backend for the college platform API built with Node.js, Express, TypeScript, and Prisma.

## Setup

1. Install dependencies:

```bash
cd "c:\New folder\college-platform-backend"
npm install
```

2. Update `.env` with your PostgreSQL database URL and JWT secret.

3. Initialize Prisma and migrate:

```bash
npx prisma migrate dev --name init
```

4. Seed sample college data:

```bash
npx ts-node prisma/seed.ts
```

5. Start the development server:

```bash
npm run dev
```

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /colleges`
- `GET /colleges/:id`
- `POST /colleges/compare`
- `POST /save`
- `GET /save`
- `DELETE /save/:id`
