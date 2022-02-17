import { intArg, nonNull, nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const postArgs = {
  storyAccessToken: nullable(stringArg()),
  storyPage: nonNull(intArg()),
  storyPageSize: nonNull(intArg()),
}

const reviewArgs = {
  reviewAccessToken: nullable(stringArg()),
  reviewPage: nonNull(intArg()),
  reviewPageSize: nonNull(intArg()),
}

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id")
    t.string("user_name")
    t.string("user_deal")
    t.string("image")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("stories", {
      type: "Story",
      args: postArgs,
      resolve: async (parent, args) => {
        const { storyAccessToken, storyPage, storyPageSize } = args
        const skip = storyPageSize * (Number(storyPage) - 1)
        return storyAccessToken && isSafe(storyAccessToken, `${parent.id}`)
          ? await prisma.user
              .findUnique({
                where: { id: parent.id || undefined },
              })
              .stories({
                orderBy: { created_at: "desc" },
                skip,
                take: storyPageSize,
              })
          : await prisma.user
              .findUnique({
                where: { id: parent.id || undefined },
              })
              .stories({
                orderBy: { created_at: "desc" },
                skip,
                take: storyPageSize,
                where: { publish: true },
              })
      },
    })
    t.list.field("reviews", {
      type: "Review",
      args: reviewArgs,
      resolve: async (parent, args) => {
        const { reviewPage, reviewPageSize } = args
        const skip = reviewPageSize * (Number(reviewPage) - 1)
        return await prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .reviews({
            orderBy: { created_at: "desc" },
            skip,
            take: reviewPageSize,
          })
      },
    })
    t.list.field("follows", {
      type: "Follow",
      resolve: async (parent, _) => {
        return await prisma.user
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .follows()
      },
    })
    t.list.field("favorites", {
      type: "Favorite",
      resolve: async (parent, _) => {
        return await prisma.user
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .favorites()
      },
    })
    t.list.field("notifications", {
      type: "Notification",
      resolve: async (parent, _) => {
        return await prisma.user
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .Notification()
      },
    })
  },
})

export { User }
