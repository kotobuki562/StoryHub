/*
  Warnings:

  - You are about to drop the column `setting_materia_id` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `setting_materia_id` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `setting_materia_id` on the `Terminology` table. All the data in the column will be lost.
  - You are about to drop the `SettingMateria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `setting_material_id` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setting_material_id` to the `Object` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setting_material_id` to the `Terminology` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_setting_materia_id_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_setting_materia_id_fkey";

-- DropForeignKey
ALTER TABLE "SettingMateria" DROP CONSTRAINT "SettingMateria_story_id_fkey";

-- DropForeignKey
ALTER TABLE "SettingMateria" DROP CONSTRAINT "SettingMateria_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Terminology" DROP CONSTRAINT "Terminology_setting_materia_id_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "setting_materia_id",
ADD COLUMN     "setting_material_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Object" DROP COLUMN "setting_materia_id",
ADD COLUMN     "setting_material_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Terminology" DROP COLUMN "setting_materia_id",
ADD COLUMN     "setting_material_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "SettingMateria";

-- CreateTable
CREATE TABLE "SettingMaterial" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "story_id" TEXT,
    "setting_material_title" TEXT NOT NULL,
    "setting_material_deal" TEXT NOT NULL,
    "setting_material_image" TEXT,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "SettingMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SettingMaterial" ADD CONSTRAINT "SettingMaterial_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettingMaterial" ADD CONSTRAINT "SettingMaterial_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_setting_material_id_fkey" FOREIGN KEY ("setting_material_id") REFERENCES "SettingMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_setting_material_id_fkey" FOREIGN KEY ("setting_material_id") REFERENCES "SettingMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Terminology" ADD CONSTRAINT "Terminology_setting_material_id_fkey" FOREIGN KEY ("setting_material_id") REFERENCES "SettingMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
