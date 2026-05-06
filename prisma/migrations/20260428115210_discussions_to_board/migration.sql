/*
  Warnings:

  - You are about to drop the column `discussionId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the `Discussion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boardId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_discussionId_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "discussionId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Discussion";

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
