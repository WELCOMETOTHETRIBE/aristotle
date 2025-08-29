/*
  Warnings:

  - You are about to drop the column `coreValues` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `culture` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `dailyRituals` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `meta` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `moduleEmphasis` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `sayings` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `starterProtocol` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyChallenges` on the `Framework` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Framework` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aiPersonaKey` to the `Framework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `config` to the `Framework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Framework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tone` to the `Framework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Framework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `virtuePrimary` to the `Framework` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Framework" DROP COLUMN "coreValues",
DROP COLUMN "culture",
DROP COLUMN "dailyRituals",
DROP COLUMN "meta",
DROP COLUMN "moduleEmphasis",
DROP COLUMN "overview",
DROP COLUMN "sayings",
DROP COLUMN "starterProtocol",
DROP COLUMN "weeklyChallenges",
ADD COLUMN     "aiPersonaKey" TEXT,
ADD COLUMN     "config" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "virtuePrimary" TEXT,
ADD COLUMN     "virtueSecondary" TEXT;

-- Update existing Framework records with default values
UPDATE "Framework" SET 
  "aiPersonaKey" = 'stoic',
  "config" = '{}',
  "slug" = LOWER(REPLACE("name", ' ', '_')),
  "tone" = 'calm',
  "virtuePrimary" = 'wisdom',
  "updatedAt" = CURRENT_TIMESTAMP;

-- Make columns NOT NULL after setting default values
ALTER TABLE "Framework" ALTER COLUMN "aiPersonaKey" SET NOT NULL,
ALTER COLUMN "config" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "tone" SET NOT NULL,
ALTER COLUMN "virtuePrimary" SET NOT NULL;

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "virtueGrantPerCompletion" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "widgetIds" TEXT[],
    "minutes" INTEGER NOT NULL,
    "virtueGrants" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT,
    "widgetId" TEXT NOT NULL,
    "frameworkSlug" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "virtues" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPIReading" (
    "id" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KPIReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capstone" (
    "id" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capstone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Framework_slug_key" ON "Framework"("slug");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_frameworkSlug_fkey" FOREIGN KEY ("frameworkSlug") REFERENCES "Framework"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPIReading" ADD CONSTRAINT "KPIReading_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Capstone" ADD CONSTRAINT "Capstone_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
