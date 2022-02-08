/*
  Warnings:

  - A unique constraint covering the columns `[receiver_id,review_id,favorite_id,follow_id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_receiver_id_review_id_favorite_id_follow_id_key" ON "Notification"("receiver_id", "review_id", "favorite_id", "follow_id");
