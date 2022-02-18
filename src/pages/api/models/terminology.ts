import { objectType } from "nexus"
import prisma from "src/lib/prisma"

export const Terminology = objectType({
  name: "Terminology",
  definition(t) {
    t.id("id")
    t.string("setting_material_id")
    t.string("season_id")
    t.string("terminology_name")
    t.string("terminology_deal")
    t.boolean("isSpoiler")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.field("settingMaterial", {
      type: "SettingMaterial",
      resolve: async parent => {
        return await prisma.terminology
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
        return await prisma.terminology
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
