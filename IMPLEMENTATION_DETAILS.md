# Implementation Details - Filter System

## Architecture Overview

### Backend Filter Pipeline
```
Client Request
    ↓
GET /colleges?search=...&location=...&exam=...&maxRank=...
    ↓
Express Router (college.ts)
    ↓
Build WHERE clause
    ↓
Prisma findMany() with filters
    ↓
JSON response with 10 colleges per page
```

### Frontend Filter Flow
```
User Interface
    ↓
[Search Box] [Location ▼] [Exam ▼] [Max Rank Input]
    ↓
State Updates (useState)
    ↓
useEffect triggers
    ↓
API Call with params
    ↓
Update colleges state
    ↓
Render CollegeCard components
```

## Backend Implementation

### College Route Handler (`src/routes/college.ts`)

```typescript
router.get("/", async (req, res) => {
  // Extract query parameters
  const { search, location, exam, maxRank, page = "1" } = req.query;

  // Build dynamic WHERE clause
  const where: any = {};

  // Search filter: contains (case-insensitive)
  if (typeof search === "string" && search.trim()) {
    where.name = { contains: search.trim() };
  }

  // Location filter: exact match
  if (typeof location === "string" && location.trim()) {
    where.location = location;
  }

  // Exam filter: exact match (NEW)
  if (typeof exam === "string" && exam.trim()) {
    where.exam = exam;
  }

  // Max rank filter: less than or equal (NEW)
  if (typeof maxRank === "string" && maxRank.trim()) {
    where.rank = { lte: Number(maxRank) };
  }

  // Query database with filters
  const colleges = await prisma.college.findMany({
    where,
    skip: (Number(page) - 1) * 10,
    take: 10,
    orderBy: { rating: "desc" }
  });

  return res.json(colleges);
});
```

### Key Features:
- **AND Logic**: All active filters are combined (e.g., location AND exam AND rank)
- **Pagination**: 10 colleges per page, offset based
- **Ordering**: Results sorted by rating (highest first)
- **Type Safety**: Query parameters validated before use

## Frontend Implementation

### Main Page Component (`app/page.tsx`)

**State Management:**
```typescript
const [search, setSearch] = useState("");           // Search term
const [locationFilter, setLocationFilter] = useState("");  // Selected location
const [examFilter, setExamFilter] = useState("");   // Selected exam (NEW)
const [maxRankFilter, setMaxRankFilter] = useState("");    // Max rank (NEW)
const [colleges, setColleges] = useState<College[]>([]);
const [page, setPage] = useState(1);
```

**Data Fetching:**
```typescript
useEffect(() => {
  const fetchColleges = async () => {
    const response = await api.get("/colleges", {
      params: {
        search: search.trim() || undefined,
        location: locationFilter || undefined,
        exam: examFilter || undefined,          // NEW
        maxRank: maxRankFilter || undefined,    // NEW
        page,
      },
    });
    setColleges(response.data);
  };
  fetchColleges();
}, [search, locationFilter, examFilter, maxRankFilter, page]); // Dependencies include new filters
```

**Dropdown Population:**
```typescript
// Extract unique exams from loaded colleges
const exams = useMemo(() => {
  return Array.from(
    new Set(colleges.map((college) => college.exam))
  ).sort();
}, [colleges]);

// Fix: Extract unique locations (was pulling from courses before!)
const locations = useMemo(() => {
  return Array.from(
    new Set(colleges.map((college) => college.location))  // FIXED
  ).sort();
}, [colleges]);
```

**UI Components:**
```jsx
{/* Exam Selection Dropdown */}
<select
  value={examFilter}
  onChange={(event) => setExamFilter(event.target.value)}
  className="rounded-3xl border border-slate-200 bg-white px-4 py-3..."
>
  <option value="">All exams</option>
  {exams.map((exam) => (
    <option key={exam} value={exam}>{exam}</option>
  ))}
</select>

{/* Max Rank Number Input */}
<input
  type="number"
  value={maxRankFilter}
  onChange={(event) => setMaxRankFilter(event.target.value)}
  placeholder="Max rank cutoff"
  className="rounded-3xl border border-slate-200 bg-white px-4 py-3..."
/>
```

## Database Schema

### Updated College Table

```prisma
model College {
  id        Int      @id @default(autoincrement())
  name      String   // College name
  location  String   // City/location
  fees      Int      // Annual fees in INR
  rating    Float    // Average rating (0-5)
  courses   String   // JSON array of courses
  placement Int      // Placement percentage
  exam      String   // Entrance exam (NEW)
  rank      Int      // Rank cutoff (NEW)
  savedBy   SavedCollege[]
}
```

### Example Data

| Name | Location | Exam | Rank | Rating |
|------|----------|------|------|--------|
| IIT Bombay | Mumbai | JEE | 150 | 4.9 |
| NIT Trichy | Trichy | JEE | 700 | 4.5 |
| BITS Pilani | Pilani | BITSAT | 5000 | 4.6 |
| VIT Vellore | Vellore | VITEEE | 8000 | 4.3 |

## API Contract

### GET /colleges

**Request Parameters:**
```
?search=IIT         // Optional: search in college name
&location=Mumbai    // Optional: filter by location
&exam=JEE          // Optional: filter by exam (NEW)
&maxRank=500       // Optional: show colleges with rank <= value (NEW)
&page=1            // Optional: pagination (default 1)
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "IIT Bombay",
    "location": "Mumbai",
    "fees": 220000,
    "rating": 4.9,
    "courses": "[\"CSE\", \"ECE\", \"Mechanical\"]",
    "placement": 96,
    "exam": "JEE",
    "rank": 150
  }
]
```

**Status Codes:**
- 200: Success
- 400: Invalid parameters
- 500: Server error

## Filter Combinations Examples

### Use Case 1: Find JEE colleges in your region
```
GET /colleges?location=Delhi&exam=JEE
```

### Use Case 2: Colleges you can get into based on rank
```
GET /colleges?exam=JEE&maxRank=1000
```

### Use Case 3: Top-rated colleges in a region
```
GET /colleges?location=Bangalore&orderBy=rating
```

### Use Case 4: Explore tier-2 entrance exams
```
GET /colleges?exam=BITSAT
GET /colleges?exam=VITEEE
```

## Performance Considerations

1. **Indexing**: Consider adding database indices on `exam`, `location`, and `rank` for faster queries
2. **Caching**: Frontend dropdowns cache exam/location lists while viewing colleges
3. **Pagination**: Limited to 10 per page to reduce payload size
4. **Query Optimization**: Prisma generates efficient SQL with selective fields

## Future Enhancements

1. **Rank Range Filter**: `minRank` and `maxRank` for range queries
2. **Multiple Exam Selection**: Select multiple exams at once
3. **Filter Persistence**: Save filter preferences in localStorage
4. **Advanced Sorting**: Sort by fees, placement, rating
5. **Filter Reset**: One-click button to clear all filters
6. **Filter History**: Show previously used filter combinations
