import { objectType } from "nexus"
import prisma from "src/lib/prisma"

// model Object {
//   id                  String          @id @default(uuid())
//   setting_material_id String
//   object_name         String
//   object_deal         String
//   object_image        String?
//   isSpoiler           Boolean         @default(false) @db.Boolean
//   publish             Boolean         @default(false) @db.Boolean
//   created_at          DateTime        @default(now())
//   updated_at          DateTime?
//   settingMaterial     SettingMaterial @relation(fields: [setting_material_id], references: [id])
// }

export const Object = objectType({
  name: "Object",
  definition(t) {
    t.id("id")
    t.string("setting_material_id")
    t.string("season_id")
    t.string("object_name")
    t.string("object_deal")
    t.string("object_image")
    t.boolean("isSpoiler")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.field("settingMaterial", {
      type: "SettingMaterial",
      resolve: async parent => {
        return await prisma.object
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
        return await prisma.object
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
