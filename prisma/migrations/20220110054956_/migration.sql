/*
  Warnings:

  - Made the column `user_id` on table `Follow` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_story_id_fkey";

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "story_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SettingMateria" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "story_id" TEXT,
    "setting_material_title" TEXT NOT NULL,
    "setting_material_deal" TEXT NOT NULL,
    "setting_material_image" TEXT,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "SettingMateria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "setting_materia_id" TEXT NOT NULL,
    "character_name" TEXT NOT NULL,
    "character_sex" TEXT NOT NULL,
    "character_category" TEXT NOT NULL,
    "character_deal" TEXT NOT NULL,
    "character_image" TEXT,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Object" (
    "id" TEXT NOT NULL,
    "setting_materia_id" TEXT NOT NULL,
    "object_name" TEXT NOT NULL,
    "object_deal" TEXT NOT NULL,
    "object_image" TEXT,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Object_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terminology" (
    "id" TEXT NOT NULL,
    "setting_materia_id" TEXT NOT NULL,
    "terminology_name" TEXT NOT NULL,
    "terminology_deal" TEXT NOT NULL,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Terminology_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettingMateria" ADD CONSTRAINT "SettingMateria_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettingMateria" ADD CONSTRAINT "SettingMateria_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_setting_materia_id_fkey" FOREIGN KEY ("setting_materia_id") REFERENCES "SettingMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_setting_materia_id_fkey" FOREIGN KEY ("setting_materia_id") REFERENCES "SettingMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Terminology" ADD CONSTRAINT "Terminology_setting_materia_id_fkey" FOREIGN KEY ("setting_materia_id") REFERENCES "SettingMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
