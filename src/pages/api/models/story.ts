import { intArg, nonNull, nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const seasonArgs = {
  seasonAccessToken: nullable(stringArg()),
  seasonUserId: nullable(stringArg()),
  seasonPage: nonNull(intArg()),
  seasonPageSize: nonNull(intArg()),
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
      resolve: (parent, args, ctx) => {
        const { seasonAccessToken, seasonUserId, seasonPage, seasonPageSize } =
          args
        const skip = seasonPageSize * (seasonPage - 1)
        return seasonAccessToken &&
          seasonUserId &&
          isSafe(seasonAccessToken, seasonUserId)
          ? prisma.season.findMany({
              skip,
              take: seasonPageSize,
              orderBy: { created_at: "desc" },
              where: {
                story_id: `${parent.id}`,
              },
            })
          : prisma.season.findMany({
              skip,
              take: seasonPageSize,
              orderBy: { created_at: "desc" },
              where: {
                story_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
    t.list.field("reviews", {
      type: "Review",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.review.findMany({
              where: {
                story_id: parent.id,
                publish: true,
              },
            })
          : []
      },
    })
    t.list.field("favorites", {
      type: "Favorite",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.favorite.findMany({
              where: {
                story_id: parent.id,
              },
            })
          : []
      },
    })
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
  },
})

export { Story }
