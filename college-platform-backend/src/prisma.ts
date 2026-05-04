import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("Prisma connected to the database"))
  .catch((error) => {
    console.error("Prisma failed to connect to the database:", error);
    process.exit(1);
  });
