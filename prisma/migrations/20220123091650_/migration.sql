/*
  Warnings:

  - You are about to drop the column `publish` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "publish",
ALTER COLUMN "stars" SET DEFAULT 1;
