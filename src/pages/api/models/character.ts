import { objectType } from "nexus"
import prisma from "src/lib/prisma"

export const Character = objectType({
  name: "Character",
  definition(t) {
    t.id("id")
    t.string("setting_material_id")
    t.string("season_id")
    t.string("character_name")
    t.string("character_sex")
    t.string("character_category")
    t.string("character_deal")
    t.string("character_image")
    t.boolean("isSpoiler")
    t.boolean("publish")
    t.date("created_at")
    t.date("updated_at")
    t.field("settingMaterial", {
      type: "SettingMaterial",
      resolve: parent =>
        prisma.settingMaterial.findUnique({
          where: {
            id: `${parent.setting_material_id}`,
          },
        }),
    })
    t.field("season", {
      type: "Season",
      resolve: parent =>
        prisma.season.findUnique({
          where: {
            id: `${parent.season_id}`,
          },
        }),
    })
  },
})
