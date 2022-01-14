/*
  Warnings:

  - The `season_categories` column on the `Season` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `story_categories` column on the `Story` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Season" DROP COLUMN "season_categories",
ADD COLUMN     "season_categories" TEXT[];

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "story_categories",
ADD COLUMN     "story_categories" TEXT[];
