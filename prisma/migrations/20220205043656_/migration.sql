/*
  Warnings:

  - You are about to drop the column `story_id` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_story_id_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "story_id";
