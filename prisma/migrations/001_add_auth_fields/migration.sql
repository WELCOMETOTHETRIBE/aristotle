-- Add authentication fields to User table
ALTER TABLE "User" ADD COLUMN "username" TEXT UNIQUE NOT NULL;
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL;
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create index on username for faster lookups
CREATE INDEX "User_username_idx" ON "User"("username"); 