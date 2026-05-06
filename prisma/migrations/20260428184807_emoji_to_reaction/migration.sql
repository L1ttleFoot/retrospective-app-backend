/*
  Warnings:

  - You are about to drop the `Emoji` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageEmoji` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageEmoji" DROP CONSTRAINT "MessageEmoji_emojiId_fkey";

-- DropForeignKey
ALTER TABLE "MessageEmoji" DROP CONSTRAINT "MessageEmoji_messageId_fkey";

-- DropTable
DROP TABLE "Emoji";

-- DropTable
DROP TABLE "MessageEmoji";

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "character" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_character_key" ON "Reaction"("character");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_reactionId_messageId_authorId_key" ON "MessageReaction"("reactionId", "messageId", "authorId");

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
