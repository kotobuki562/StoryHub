import { nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const characterArgs = {
  storyAccessToken: nullable(stringArg()),
}

const objectArgs = {
  reviewAccessToken: nullable(stringArg()),
}

const terminologyArgs = {
  terminologyAccessToken: nullable(stringArg()),
}

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
      resolve: async parent => {
        return await prisma.user.findUnique({
          where: {
            id: `${parent.user_id}`,
          },
        })
      },
    })
    t.field("story", {
      type: "Story",
      args: characterArgs,
      resolve: async parent => {
        return await prisma.story.findUnique({
          where: {
            id: `${parent.story_id}`,
          },
        })
      },
    })
    t.list.field("character", {
      type: "Character",
      args: characterArgs,
      resolve: async (parent, args) => {
        const { storyAccessToken } = args
        return storyAccessToken && isSafe(storyAccessToken, `${parent.user_id}`)
          ? await prisma.character.findMany({
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
              },
            })
          : await prisma.character.findMany({
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
      resolve: async (parent, args) => {
        const { reviewAccessToken } = args
        return reviewAccessToken &&
          isSafe(reviewAccessToken, `${parent.user_id}`)
          ? await prisma.object.findMany({
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
              },
            })
          : await prisma.object.findMany({
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
      resolve: async (parent, args) => {
        const { terminologyAccessToken } = args
        return terminologyAccessToken &&
          isSafe(terminologyAccessToken, `${parent.user_id}`)
          ? await prisma.terminology.findMany({
              orderBy: { created_at: "desc" },
              where: {
                setting_material_id: `${parent.id}`,
              },
            })
          : await prisma.terminology.findMany({
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
