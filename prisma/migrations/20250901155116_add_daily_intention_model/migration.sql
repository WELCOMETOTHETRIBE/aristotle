-- CreateTable
CREATE TABLE "DailyIntention" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timePeriod" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "intention" TEXT NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "DailyIntention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyIntention_userId_date_timePeriod_key" ON "DailyIntention"("userId", "date", "timePeriod");

-- AddForeignKey
ALTER TABLE "DailyIntention" ADD CONSTRAINT "DailyIntention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
