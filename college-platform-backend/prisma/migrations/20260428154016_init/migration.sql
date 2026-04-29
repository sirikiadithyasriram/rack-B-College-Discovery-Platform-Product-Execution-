/*
  Warnings:

  - Added the required column `exam` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `College` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_College" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "fees" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "courses" TEXT NOT NULL,
    "placement" INTEGER NOT NULL,
    "exam" TEXT NOT NULL,
    "rank" INTEGER NOT NULL
);
INSERT INTO "new_College" ("courses", "fees", "id", "location", "name", "placement", "rating") SELECT "courses", "fees", "id", "location", "name", "placement", "rating" FROM "College";
DROP TABLE "College";
ALTER TABLE "new_College" RENAME TO "College";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
