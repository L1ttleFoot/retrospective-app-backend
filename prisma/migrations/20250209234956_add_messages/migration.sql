-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
