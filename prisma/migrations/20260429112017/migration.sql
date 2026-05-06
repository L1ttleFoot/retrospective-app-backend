/*
  Warnings:

  - You are about to drop the column `character` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reaction_character_key";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "character",
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_value_key" ON "Reaction"("value");
