import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  const { search, location, exam, maxRank, page = "1" } = req.query;

  const where: any = {};

  if (typeof search === "string" && search.trim()) {
    where.name = { contains: search.trim() };
  }

  if (typeof location === "string" && location.trim()) {
    where.location = location;
  }

  if (typeof exam === "string" && exam.trim()) {
    where.exam = exam;
  }

  if (typeof maxRank === "string" && maxRank.trim()) {
    where.rank = { lte: Number(maxRank) };
  }

  try {
    const colleges = await prisma.college.findMany({
      where,
      skip: (Number(page) - 1) * 10,
      take: 10,
      orderBy: { rating: "desc" }
    });

    return res.json(colleges);
  } catch (error) {
    console.error("[colleges] GET / failed:", error);
    return res.status(500).json({ error: "Unable to load colleges" });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid college id" });
  }

  try {
    const college = await prisma.college.findUnique({ where: { id } });
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    return res.json(college);
  } catch (error) {
    console.error(`[colleges] GET /${id} failed:`, error);
    return res.status(500).json({ error: "Unable to load college" });
  }
});

router.post("/compare", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
    return res.status(400).json({ error: "Provide 2 to 3 college ids to compare" });
  }

  try {
    const colleges = await prisma.college.findMany({
      where: { id: { in: ids.map(Number) } }
    });

    return res.json(colleges);
  } catch (error) {
    console.error("[colleges] POST /compare failed:", error);
    return res.status(500).json({ error: "Unable to compare colleges" });
  }
});

export default router;
