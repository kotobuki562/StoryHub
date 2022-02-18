-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notification_title" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);
