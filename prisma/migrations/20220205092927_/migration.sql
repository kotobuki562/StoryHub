/*
  Warnings:

  - A unique constraint covering the columns `[receiver_id,review_id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiver_id,favorite_id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiver_id,follow_id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Notification_receiver_id_review_id_favorite_id_follow_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Notification_receiver_id_review_id_key" ON "Notification"("receiver_id", "review_id");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_receiver_id_favorite_id_key" ON "Notification"("receiver_id", "favorite_id");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_receiver_id_follow_id_key" ON "Notification"("receiver_id", "follow_id");
