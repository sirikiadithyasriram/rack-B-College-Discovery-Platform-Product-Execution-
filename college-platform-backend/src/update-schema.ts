import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateSchema() {
  try {
    console.log("Updating database schema...");
    
    // Use raw queries to add columns if they don't exist
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE "College" ADD COLUMN "exam" TEXT NOT NULL DEFAULT "JEE"');
      console.log("Added exam column");
    } catch (e: any) {
      if (!e.message.includes("duplicate column")) {
        throw e;
      }
      console.log("exam column already exists");
    }
    
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE "College" ADD COLUMN "rank" INTEGER NOT NULL DEFAULT 1000');
      console.log("Added rank column");
    } catch (e: any) {
      if (!e.message.includes("duplicate column")) {
        throw e;
      }
      console.log("rank column already exists");
    }
    
    console.log("Schema update completed");
  } catch (error) {
    console.error("Schema update failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateSchema();
