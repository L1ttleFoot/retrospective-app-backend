-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_discussionId_fkey";

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
