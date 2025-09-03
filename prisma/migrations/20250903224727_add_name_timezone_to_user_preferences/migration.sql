/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `MoodLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserPreference" ADD COLUMN     "name" TEXT,
ADD COLUMN     "timezone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MoodLog_userId_date_key" ON "MoodLog"("userId", "date");
