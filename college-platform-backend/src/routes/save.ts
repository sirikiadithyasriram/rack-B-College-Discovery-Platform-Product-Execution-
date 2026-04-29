import express from "express";
import { prisma } from "../prisma";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, async (req: any, res) => {
  const { collegeId } = req.body;
  if (!collegeId) {
    return res.status(400).json({ error: "collegeId is required" });
  }

  const college = await prisma.college.findUnique({ where: { id: Number(collegeId) } });
  if (!college) {
    return res.status(404).json({ error: "College not found" });
  }

  const saved = await prisma.savedCollege.create({
    data: {
      collegeId: Number(collegeId),
      userId: req.user.userId
    }
  });

  return res.json(saved);
});

router.get("/", authMiddleware, async (req: any, res) => {
  const saved = await prisma.savedCollege.findMany({
    where: { userId: req.user.userId },
    include: { college: true }
  });

  return res.json(saved);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  await prisma.savedCollege.delete({ where: { id } });
  return res.json({ message: "Deleted" });
});

export default router;
