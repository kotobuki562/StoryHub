import { intArg, nonNull, objectType, stringArg, nullable } from "nexus"
import prisma from "src/lib/prisma"
import { isSafe } from "../index.page"

// model Terminology {
//   id                  String          @id @default(uuid())
//   setting_material_id String
//   terminology_name    String
//   terminology_deal    String
//   isSpoiler           Boolean         @default(false) @db.Boolean
//   publish             Boolean         @default(false) @db.Boolean
//   created_at          DateTime        @default(now())
//   updated_at          DateTime?
//   settingMaterial     SettingMaterial @relation(fields: [setting_material_id], references: [id])
// }

export const Terminology = objectType({
  name: "Terminology",
  definition(t) {
    t.id("id")
    t.string("setting_material_id")
    t.string("terminology_name")
    t.string("terminology_deal")
    t.boolean("isSpoiler")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
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