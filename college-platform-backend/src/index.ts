import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import collegeRoutes from "./routes/college";
import saveRoutes from "./routes/save";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);
const jwtSecret = process.env.JWT_SECRET;
const corsOrigin = process.env.CORS_ORIGIN;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

app.use(cors({
  origin: corsOrigin ? corsOrigin.split(",").map((origin) => origin.trim()) : "*"
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/colleges", collegeRoutes);
app.use("/save", saveRoutes);

app.get("/", (_req, res) => {
  res.send("College platform API is running.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
