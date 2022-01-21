-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "season_id" TEXT;

-- AlterTable
ALTER TABLE "Object" ADD COLUMN     "season_id" TEXT;

-- AlterTable
ALTER TABLE "Terminology" ADD COLUMN     "season_id" TEXT;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Terminology" ADD CONSTRAINT "Terminology_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
