/*
  Warnings:

  - Added the required column `virtue` to the `VirtuePractice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneratedContent" ADD COLUMN "virtuePracticeId" INTEGER;

-- CreateTable
CREATE TABLE "UserPreference" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "framework" TEXT,
    "style" TEXT,
    "locale" TEXT DEFAULT 'en',
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VirtuePractice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "virtue" TEXT NOT NULL DEFAULT 'Wisdom',
    "shortDesc" TEXT,
    "targetModuleId" TEXT,
    "tags" TEXT DEFAULT '[]',
    "safety" TEXT,
    "measurement" TEXT,
    "description" TEXT,
    "instructions" TEXT,
    "rationale" TEXT,
    "metrics" TEXT,
    "safetyNotes" TEXT,
    "coachPrompts" TEXT,
    "meta" TEXT DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_VirtuePractice" ("coachPrompts", "createdAt", "description", "id", "instructions", "meta", "metrics", "rationale", "safetyNotes", "slug", "title", "updatedAt", "virtue") SELECT "coachPrompts", "createdAt", "description", "id", "instructions", "meta", "metrics", "rationale", "safetyNotes", "slug", "title", "updatedAt", 'Wisdom' FROM "VirtuePractice";
DROP TABLE "VirtuePractice";
ALTER TABLE "new_VirtuePractice" RENAME TO "VirtuePractice";
CREATE UNIQUE INDEX "VirtuePractice_slug_key" ON "VirtuePractice"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
