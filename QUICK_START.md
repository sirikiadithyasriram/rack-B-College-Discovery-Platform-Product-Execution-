# Quick Start - College Filter System

## ⚡ 5-Minute Setup

### Terminal 1: Backend
```bash
cd college-platform-backend
npm run setup:db    # Initialize database with colleges
npm run dev         # Start backend on port 5000
```

### Terminal 2: Frontend
```bash
cd college-platform-frontend
npm run dev         # Start frontend on port 3000
```

### Open Browser
```
http://localhost:3000
```

## 🧪 Test Filters

Try these combinations:

| Filter | Value | Result |
|--------|-------|--------|
| Search | "IIT" | All IIT colleges |
| Location | "Mumbai" | Colleges in Mumbai |
| Exam | "JEE" | JEE entrance exams |
| Max Rank | "500" | Colleges with rank ≤ 500 |
| **Combined** | JEE + rank 500 | JEE colleges top tier |

## 📋 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change `PORT` in `.env` |
| DB errors | Delete `dev.db` and run `npm run setup:db` |
| No colleges shown | Restart backend, check browser console |
| Exam/Location empty | Database not seeded, run `npm run setup:db` |

## 📚 Learn More

- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `IMPLEMENTATION_DETAILS.md` - Technical deep dive
- `FIX_SUMMARY.md` - What was broken and fixed

## ✅ Features Working

- ✓ Search by college name
- ✓ Filter by location (city)
- ✓ Filter by exam (JEE, BITSAT, etc.)
- ✓ Filter by max rank cutoff
- ✓ Combine multiple filters
- ✓ Pagination (10 per page)
- ✓ Sort by rating

---

**Ready to go!** 🚀
