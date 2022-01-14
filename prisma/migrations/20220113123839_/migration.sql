/*
  Warnings:

  - You are about to drop the column `user_id` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_user_id_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "user_id";
