/*
  Warnings:

  - Made the column `category_title` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `episode_id` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chapter_title` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season_id` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `episode_title` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Favorite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `story_id` on table `Favorite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chapter_id` on table `Page` required. This step will fail if there are existing NULL values in that column.
  - Made the column `page_body` on table `Page` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `story_id` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `review_title` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `review_body` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stars` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `story_id` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season_title` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Story` required. This step will fail if there are existing NULL values in that column.
  - Made the column `story_title` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_season_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_story_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_story_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_story_id_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_user_id_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "category_title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "episode_id" SET NOT NULL,
ALTER COLUMN "chapter_title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "season_id" SET NOT NULL,
ALTER COLUMN "episode_title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "story_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "chapter_id" SET NOT NULL,
ALTER COLUMN "page_body" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "story_id" SET NOT NULL,
ALTER COLUMN "review_title" SET NOT NULL,
ALTER COLUMN "review_body" SET NOT NULL,
ALTER COLUMN "stars" SET NOT NULL,
ALTER COLUMN "stars" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "story_id" SET NOT NULL,
ALTER COLUMN "season_title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "story_title" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
