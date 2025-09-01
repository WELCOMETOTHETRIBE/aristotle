-- AlterTable
ALTER TABLE "CommunityReply" ADD COLUMN     "isAI" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "philosopher" TEXT;
