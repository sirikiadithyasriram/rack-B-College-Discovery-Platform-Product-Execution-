# College Platform - Setup and Filter Fix Instructions

## Summary of Changes

Your college platform now has a **fully functional exam-based ranking system** with filters for:
- **Search**: By college name
- **Location**: Filter by city
- **Exam**: Filter by entrance exam (JEE, BITSAT, VITEEE, etc.)
- **Max Rank**: Filter by maximum rank cutoff

## Quick Start

### 1. Update Database Schema

Run the setup script to add exam and rank columns to the database and seed with data:

```bash
cd college-platform-backend
npm run setup:db
```

This will:
- Add `exam` and `rank` columns to the College table
- Populate all 25 colleges with realistic exam names and rank cutoffs
- Create fresh data for testing

### 2. Start the Backend

```bash
cd college-platform-backend
npm run dev
```

You should see:
```
Server running on port 5000
```

### 3. Start the Frontend

In a new terminal:

```bash
cd college-platform-frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

## What Was Fixed

### Backend Changes (`college-platform-backend/`)

**Schema Update** (`prisma/schema.prisma`):
- Added `exam: String` field to College model
- Added `rank: Int` field to College model

**API Enhancement** (`src/routes/college.ts`):
- Updated `/colleges` GET endpoint to support `exam` query parameter
- Updated `/colleges` GET endpoint to support `maxRank` query parameter
- Filters work together (AND logic)

**Seed Data** (`prisma/seed.ts`):
- Added realistic exam names: JEE, BITSAT, VITEEE, SRMJEEE, MET, WBJEE, TNEA, CUET, AMUEEE, PESSAT
- Added rank cutoffs ranging from 150 (IIT Bombay) to 50000 (Delhi University)
- Clears old data and seeds fresh

### Frontend Changes (`college-platform-frontend/`)

**Main Page** (`app/page.tsx`):
- **Fixed location filter**: Was incorrectly pulling from course data, now correctly uses `college.location`
- **Added exam filter**: Dropdown with dynamically populated exam options
- **Added rank filter**: Number input for max rank cutoff
- **Updated College interface**: Now includes `exam` and `rank` fields
- All filters are sent to backend API with pagination support

## Testing the Filters

1. **Open the app**: http://localhost:3000
2. **Try different filters**:
   - Search for "IIT" → Shows all IIT colleges
   - Select location "Mumbai" → Shows colleges in Mumbai
   - Select exam "JEE" → Shows JEE entrance exam colleges
   - Enter rank "500" → Shows colleges with rank cutoff ≤ 500
   - **Combine filters**: Select JEE + rank 500 → Shows JEE colleges with rank ≤ 500

## Example Queries

Here are some API queries you can test in Postman or curl:

```bash
# Get all JEE colleges
curl "http://localhost:5000/colleges?exam=JEE"

# Get colleges in Mumbai
curl "http://localhost:5000/colleges?location=Mumbai"

# Get JEE colleges with rank <= 500
curl "http://localhost:5000/colleges?exam=JEE&maxRank=500"

# Get colleges in Delhi sorted by rating
curl "http://localhost:5000/colleges?location=Delhi"

# Pagination (page 2, 10 per page)
curl "http://localhost:5000/colleges?page=2"
```

## Troubleshooting

### Backend not starting?
```bash
# Make sure dependencies are installed
npm install

# Check if port 5000 is already in use
# Kill process on port 5000 or change PORT in .env
```

### Database errors?
```bash
# Reset and reinitialize
rm college-platform-backend/prisma/dev.db
npm run setup:db
```

### Frontend can't connect to backend?
- Check that backend is running on `http://localhost:5000`
- Verify `.env.local` in frontend has: `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Check browser console for CORS errors

## Files Modified

```
college-platform-backend/
├── prisma/
│   ├── schema.prisma          (Added exam, rank fields)
│   └── seed.ts                (Updated with exam/rank data)
├── src/
│   ├── routes/college.ts      (Added filtering logic)
│   └── package.json           (Added setup:db script)
└── setup-db.ts                (New: Database setup script)

college-platform-frontend/
└── app/
    └── page.tsx               (Fixed location, added exam/rank filters)
```

## Data Structure

**College Model** now includes:
```typescript
{
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];  // JSON string
  placement: number;
  exam: string;       // NEW: e.g., "JEE", "BITSAT"
  rank: number;       // NEW: e.g., 150, 5000
}
```

All filters are working correctly and integrate seamlessly with the existing search and pagination!
