import { intArg, nonNull, objectType, stringArg, nullable } from "nexus"
import prisma from "src/lib/prisma"
import { isSafe } from "../index.page"

const characterArgs = {
  storyAccessToken: nullable(stringArg()),
  storyPage: nonNull(intArg()),
  storyPageSize: nonNull(intArg()),
}

const objectArgs = {
  reviewAccessToken: nullable(stringArg()),
  reviewPage: nonNull(intArg()),
  reviewPageSize: nonNull(intArg()),
}

const terminologyArgs = {
  terminologyAccessToken: nullable(stringArg()),
  terminologyPage: nonNull(intArg()),
  terminologyPageSize: nonNull(intArg()),
}

// model SettingMateria {
//   id                     String        @id @default(uuid())
//   user_id                String
//   story_id               String?
//   setting_material_title String
//   setting_material_deal  String
//   setting_material_image String?
//   publish                Boolean       @default(false) @db.Boolean
//   created_at             DateTime      @default(now())
//   updated_at             DateTime?
//   user                   User?         @relation(fields: [user_id], references: [id])
//   story                  Story?        @relation(fields: [story_id], references: [id])
//   Character              Character[]
//   Object                 Object[]
//   Terminology            Terminology[]
// }

export const SettingMaterial = objectType({
  name: "SettingMaterial",
  definition(t) {
    t.id("id")
    t.string("user_id")
    t.string("story_id")
    t.string("setting_material_title")
    t.string("setting_material_deal")
    t.string("setting_material_image")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        return prisma.user.findUnique({
          where: {
            id: `${parent.user_id}`,
          },
        })
      },
    })
    t.field("story", {
      type: "Story",
      args: characterArgs,
      resolve: (parent, args, ctx) => {
        return prisma.story.findUnique({
          where: {
            id: `${parent.story_id}`,
          },
        })
      },
    })
    t.list.field("character", {
      type: "Character",
      args: characterArgs,
      resolve: (parent, args, ctx) => {
        const { storyAccessToken, storyPage, storyPageSize } = args
        const skip = storyPageSize * (Number(storyPage) - 1)
        return storyAccessToken && isSafe(storyAccessToken, `${parent.user_id}`)
          ? prisma.character.findMany({
              skip,
              take: storyPageSize,
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
              },
            })
          : prisma.character.findMany({
              skip,
              take: storyPageSize,
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
    t.list.field("object", {
      type: "Object",
      args: objectArgs,
      resolve: (parent, args, ctx) => {
        const { reviewAccessToken, reviewPage, reviewPageSize } = args
        const skip = reviewPageSize * (Number(reviewPage) - 1)
        return reviewAccessToken &&
          isSafe(reviewAccessToken, `${parent.user_id}`)
          ? prisma.object.findMany({
              skip,
              take: reviewPageSize,
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
              },
            })
          : prisma.object.findMany({
              skip,
              take: reviewPageSize,
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
    t.list.field("terminology", {
      type: "Terminology",
      args: terminologyArgs,
      resolve: (parent, args, ctx) => {
        const { terminologyAccessToken, terminologyPage, terminologyPageSize } =
          args
        const skip = terminologyPageSize * (Number(terminologyPage) - 1)
        return terminologyAccessToken &&
          isSafe(terminologyAccessToken, `${parent.user_id}`)
          ? prisma.terminology.findMany({
              skip,
              take: terminologyPageSize,
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
              },
            })
          : prisma.terminology.findMany({
              skip,
              take: terminologyPageSize,
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
  },
})
