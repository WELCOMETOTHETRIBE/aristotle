-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VirtuePractice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "virtue" TEXT NOT NULL,
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
INSERT INTO "new_VirtuePractice" ("coachPrompts", "createdAt", "description", "id", "instructions", "measurement", "meta", "metrics", "rationale", "safety", "safetyNotes", "shortDesc", "slug", "tags", "targetModuleId", "title", "updatedAt", "virtue") SELECT "coachPrompts", "createdAt", "description", "id", "instructions", "measurement", "meta", "metrics", "rationale", "safety", "safetyNotes", "shortDesc", "slug", "tags", "targetModuleId", "title", "updatedAt", "virtue" FROM "VirtuePractice";
DROP TABLE "VirtuePractice";
ALTER TABLE "new_VirtuePractice" RENAME TO "VirtuePractice";
CREATE UNIQUE INDEX "VirtuePractice_slug_key" ON "VirtuePractice"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
