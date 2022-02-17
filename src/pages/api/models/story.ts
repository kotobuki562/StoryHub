import { nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const seasonArgs = {
  seasonAccessToken: nullable(stringArg()),
  seasonUserId: nullable(stringArg()),
}

const Story = objectType({
  name: "Story",
  definition(t) {
    t.id("id")
    t.string("user_id")
    t.string("story_title")
    t.string("story_synopsis")
    t.list.string("story_categories")
    t.string("story_image")
    t.boolean("publish")
    t.string("viewing_restriction")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("seasons", {
      type: "Season",
      args: seasonArgs,
      resolve: async (parent, args) => {
        const { seasonAccessToken, seasonUserId } = args
        return seasonAccessToken &&
          seasonUserId &&
          isSafe(seasonAccessToken, seasonUserId)
          ? await prisma.story
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .seasons({
                orderBy: { created_at: "asc" },
              })
          : await prisma.story
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .seasons({
                orderBy: { created_at: "asc" },
                where: { publish: true },
              })
      },
    })
    t.list.field("reviews", {
      type: "Review",
      resolve: async (parent, _) => {
        return await prisma.story
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .reviews({
            orderBy: { created_at: "desc" },
          })
      },
    })
    t.list.field("favorites", {
      type: "Favorite",
      resolve: async (parent, _) => {
        return await prisma.story
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .favorites({
            orderBy: { created_at: "desc" },
          })
      },
    })
    t.field("user", {
      type: "User",
      resolve: async (parent, _) => {
        return await prisma.story
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .user()
      },
    })
  },
})

export { Story }
