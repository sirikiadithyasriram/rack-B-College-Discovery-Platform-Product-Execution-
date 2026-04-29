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

  const colleges = await prisma.college.findMany({
    where,
    skip: (Number(page) - 1) * 10,
    take: 10,
    orderBy: { rating: "desc" }
  });

  return res.json(colleges);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid college id" });
  }

  const college = await prisma.college.findUnique({ where: { id } });
  if (!college) {
    return res.status(404).json({ error: "College not found" });
  }

  return res.json(college);
});

router.post("/compare", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
    return res.status(400).json({ error: "Provide 2 to 3 college ids to compare" });
  }

  const colleges = await prisma.college.findMany({
    where: { id: { in: ids.map(Number) } }
  });

  return res.json(colleges);
});

export default router;
