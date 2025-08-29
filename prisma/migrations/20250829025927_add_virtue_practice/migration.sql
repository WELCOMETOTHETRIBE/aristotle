-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "defaultVirtue" TEXT NOT NULL,
    "description" TEXT,
    "philosophy" TEXT,
    "scienceNotes" TEXT,
    "contraindications" TEXT,
    "commonMistakes" TEXT,
    "coachingPrompts" TEXT,
    "measurement" TEXT,
    "meta" TEXT DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "ModuleLevel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moduleId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "durationHint" TEXT,
    CONSTRAINT "ModuleLevel_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Practice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moduleId" TEXT,
    "levelId" INTEGER,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "rationale" TEXT,
    "metrics" TEXT,
    "safetyNotes" TEXT,
    "coachPrompts" TEXT,
    "meta" TEXT DEFAULT '{}',
    CONSTRAINT "Practice_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Practice_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "ModuleLevel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModuleVirtueMap" (
    "moduleId" TEXT NOT NULL,
    "virtue" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,

    PRIMARY KEY ("moduleId", "virtue"),
    CONSTRAINT "ModuleVirtueMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "thinker" TEXT,
    "era" TEXT,
    "type" TEXT NOT NULL,
    "estMinutes" INTEGER,
    "keyIdeas" TEXT DEFAULT '[]',
    "microPractices" TEXT DEFAULT '[]',
    "reflections" TEXT DEFAULT '[]',
    "level" TEXT,
    "audioUrl" TEXT,
    "meta" TEXT DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "Framework" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "culture" TEXT,
    "overview" TEXT,
    "coreValues" TEXT DEFAULT '[]',
    "dailyRituals" TEXT DEFAULT '[]',
    "weeklyChallenges" TEXT DEFAULT '[]',
    "sayings" TEXT DEFAULT '[]',
    "moduleEmphasis" TEXT DEFAULT '[]',
    "starterProtocol" TEXT DEFAULT '[]',
    "meta" TEXT DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "FrameworkModuleMap" (
    "frameworkId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "emphasis" TEXT DEFAULT '{}',

    PRIMARY KEY ("frameworkId", "moduleId"),
    CONSTRAINT "FrameworkModuleMap_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FrameworkModuleMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FrameworkPracticeMap" (
    "frameworkId" TEXT NOT NULL,
    "practiceId" INTEGER NOT NULL,
    "adaptationNote" TEXT,

    PRIMARY KEY ("frameworkId", "practiceId"),
    CONSTRAINT "FrameworkPracticeMap_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FrameworkPracticeMap_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "displayName" TEXT,
    "tz" TEXT DEFAULT 'America/Los_Angeles'
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "moduleId" TEXT,
    "practiceId" INTEGER,
    "frameworkId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "metrics" TEXT DEFAULT '{}',
    "moodPre" INTEGER,
    "moodPost" INTEGER,
    "notes" TEXT,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Session_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Session_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Session_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Streak" (
    "userId" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastDate" DATETIME NOT NULL,

    PRIMARY KEY ("userId", "moduleId"),
    CONSTRAINT "Streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Streak_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VirtueScore" (
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "wisdom" INTEGER NOT NULL DEFAULT 0,
    "courage" INTEGER NOT NULL DEFAULT 0,
    "temperance" INTEGER NOT NULL DEFAULT 0,
    "justice" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("userId", "date"),
    CONSTRAINT "VirtueScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "moduleId" TEXT,
    "frameworkId" TEXT,
    "durationDays" INTEGER NOT NULL,
    "rules" TEXT DEFAULT '{}',
    "rewardBadge" TEXT,
    CONSTRAINT "Challenge_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Challenge_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feed" (
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "items" TEXT NOT NULL,

    PRIMARY KEY ("userId", "date"),
    CONSTRAINT "Feed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GeneratedContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scope" TEXT NOT NULL,
    "keyFingerprint" TEXT NOT NULL,
    "moduleId" TEXT,
    "frameworkId" TEXT,
    "level" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "style" TEXT,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VirtuePractice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "rationale" TEXT,
    "metrics" TEXT,
    "safetyNotes" TEXT,
    "coachPrompts" TEXT,
    "slug" TEXT,
    "meta" TEXT DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleLevel_moduleId_level_key" ON "ModuleLevel"("moduleId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedContent_scope_keyFingerprint_key" ON "GeneratedContent"("scope", "keyFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "VirtuePractice_slug_key" ON "VirtuePractice"("slug");
