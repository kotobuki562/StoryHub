/*
  Warnings:

  - The primary key for the `Favorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,story_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,follow_id]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,story_id]` on the table `SettingMaterial` will be added. If there are existing duplicate values, this will fail.
  - Made the column `follow_id` on table `Follow` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `story_id` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_story_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- AlterTable
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Favorite_id_seq";

-- AlterTable
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "follow_id" SET NOT NULL,
ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Follow_id_seq";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "story_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "story_id" TEXT,
    "review_id" TEXT,
    "favorite_id" TEXT,
    "follow_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_story_id_key" ON "Favorite"("user_id", "story_id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_user_id_follow_id_key" ON "Follow"("user_id", "follow_id");

-- CreateIndex
CREATE UNIQUE INDEX "SettingMaterial_user_id_story_id_key" ON "SettingMaterial"("user_id", "story_id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_favorite_id_fkey" FOREIGN KEY ("favorite_id") REFERENCES "Favorite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_follow_id_fkey" FOREIGN KEY ("follow_id") REFERENCES "Follow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;
