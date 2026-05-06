/*
  Warnings:

  - Made the column `authorId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MessageReaction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
