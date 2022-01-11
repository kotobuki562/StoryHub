import { objectType } from "nexus"
import prisma from "src/lib/prisma"

// model Character {
//   id                 String         @id @default(uuid())
//   setting_materia_id String
//   character_name     String
//   character_sex      String
//   character_category String
//   character_deal     String
//   character_image    String?
//   isSpoiler          Boolean        @default(false) @db.Boolean
//   publish            Boolean        @default(false) @db.Boolean
//   created_at         DateTime       @default(now())
//   updated_at         DateTime?
//   settingMateria     SettingMateria @relation(fields: [setting_materia_id], references: [id])
// }

export const Character = objectType({
  name: "Character",
  definition(t) {
    t.id("id")
    t.string("setting_material_id")
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
      resolve: (parent, args, ctx) => {
        return prisma.settingMaterial.findUnique({
          where: {
            id: `${parent.setting_material_id}`,
          },
        })
      },
    })
  },
})
