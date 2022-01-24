/*
  Warnings:

  - You are about to drop the column `season_categories` on the `Season` table. All the data in the column will be lost.
  - Made the column `episode_synopsis` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season_synopsis` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `story_synopsis` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "episode_synopsis" SET NOT NULL;

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "season_categories",
ALTER COLUMN "season_synopsis" SET NOT NULL;

-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "story_synopsis" SET NOT NULL;
