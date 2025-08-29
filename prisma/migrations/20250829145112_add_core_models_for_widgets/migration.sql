-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
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
    "meta" TEXT DEFAULT '{}',

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleLevel" (
    "id" SERIAL NOT NULL,
    "moduleId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "durationHint" TEXT,

    CONSTRAINT "ModuleLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Practice" (
    "id" SERIAL NOT NULL,
    "moduleId" TEXT,
    "levelId" INTEGER,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "rationale" TEXT,
    "metrics" TEXT,
    "safetyNotes" TEXT,
    "coachPrompts" TEXT,
    "meta" TEXT DEFAULT '{}',

    CONSTRAINT "Practice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleVirtueMap" (
    "moduleId" TEXT NOT NULL,
    "virtue" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "ModuleVirtueMap_pkey" PRIMARY KEY ("moduleId","virtue")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
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
    "meta" TEXT DEFAULT '{}',

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Framework" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "culture" TEXT,
    "overview" TEXT,
    "coreValues" TEXT DEFAULT '[]',
    "dailyRituals" TEXT DEFAULT '[]',
    "weeklyChallenges" TEXT DEFAULT '[]',
    "sayings" TEXT DEFAULT '[]',
    "moduleEmphasis" TEXT DEFAULT '[]',
    "starterProtocol" TEXT DEFAULT '[]',
    "meta" TEXT DEFAULT '{}',

    CONSTRAINT "Framework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrameworkModuleMap" (
    "frameworkId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "emphasis" TEXT DEFAULT '{}',

    CONSTRAINT "FrameworkModuleMap_pkey" PRIMARY KEY ("frameworkId","moduleId")
);

-- CreateTable
CREATE TABLE "FrameworkPracticeMap" (
    "frameworkId" TEXT NOT NULL,
    "practiceId" INTEGER NOT NULL,
    "adaptationNote" TEXT,

    CONSTRAINT "FrameworkPracticeMap_pkey" PRIMARY KEY ("frameworkId","practiceId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "displayName" TEXT,
    "tz" TEXT DEFAULT 'America/Los_Angeles',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "moduleId" TEXT,
    "practiceId" INTEGER,
    "frameworkId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "metrics" TEXT DEFAULT '{}',
    "moodPre" INTEGER,
    "moodPost" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "userId" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("userId","moduleId")
);

-- CreateTable
CREATE TABLE "VirtueScore" (
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "wisdom" INTEGER NOT NULL DEFAULT 0,
    "courage" INTEGER NOT NULL DEFAULT 0,
    "temperance" INTEGER NOT NULL DEFAULT 0,
    "justice" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "VirtueScore_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "moduleId" TEXT,
    "frameworkId" TEXT,
    "durationDays" INTEGER NOT NULL,
    "rules" TEXT DEFAULT '{}',
    "rewardBadge" TEXT,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feed" (
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "items" TEXT NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "GeneratedContent" (
    "id" SERIAL NOT NULL,
    "scope" TEXT NOT NULL,
    "keyFingerprint" TEXT NOT NULL,
    "moduleId" TEXT,
    "virtuePracticeId" INTEGER,
    "frameworkId" TEXT,
    "level" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "style" TEXT,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtuePractice" (
    "id" SERIAL NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtuePractice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "userId" INTEGER NOT NULL,
    "framework" TEXT,
    "style" TEXT,
    "locale" TEXT DEFAULT 'en',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'M',
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitCheck" (
    "id" SERIAL NOT NULL,
    "habitId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FastingSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "protocol" TEXT NOT NULL,
    "targetHours" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "FastingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FastingBenefit" (
    "id" SERIAL NOT NULL,
    "fastingSessionId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FastingBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HydrationLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ml" INTEGER NOT NULL,
    "source" TEXT,

    CONSTRAINT "HydrationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mood" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "MoodLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimerSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "meta" JSONB,

    CONSTRAINT "TimerSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleLevel_moduleId_level_key" ON "ModuleLevel"("moduleId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedContent_scope_keyFingerprint_key" ON "GeneratedContent"("scope", "keyFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "VirtuePractice_slug_key" ON "VirtuePractice"("slug");

-- AddForeignKey
ALTER TABLE "ModuleLevel" ADD CONSTRAINT "ModuleLevel_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "ModuleLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleVirtueMap" ADD CONSTRAINT "ModuleVirtueMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameworkModuleMap" ADD CONSTRAINT "FrameworkModuleMap_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameworkModuleMap" ADD CONSTRAINT "FrameworkModuleMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameworkPracticeMap" ADD CONSTRAINT "FrameworkPracticeMap_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameworkPracticeMap" ADD CONSTRAINT "FrameworkPracticeMap_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtueScore" ADD CONSTRAINT "VirtueScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitCheck" ADD CONSTRAINT "HabitCheck_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FastingSession" ADD CONSTRAINT "FastingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FastingBenefit" ADD CONSTRAINT "FastingBenefit_fastingSessionId_fkey" FOREIGN KEY ("fastingSessionId") REFERENCES "FastingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HydrationLog" ADD CONSTRAINT "HydrationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodLog" ADD CONSTRAINT "MoodLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimerSession" ADD CONSTRAINT "TimerSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
