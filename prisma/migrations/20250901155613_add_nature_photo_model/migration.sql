-- CreateTable
CREATE TABLE "NaturePhoto" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imagePath" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "tags" TEXT[],
    "location" TEXT,
    "weather" TEXT,
    "mood" TEXT,
    "aiInsights" TEXT,
    "aiComment" TEXT,

    CONSTRAINT "NaturePhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NaturePhoto" ADD CONSTRAINT "NaturePhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
