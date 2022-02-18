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
      resolve: async parent => {
        return await prisma.character
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .settingMaterial()
      },
    })
    t.field("season", {
      type: "Season",
      resolve: async parent => {
        return await prisma.character
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .season()
      },
    })
  },
})
