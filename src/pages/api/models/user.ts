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
      resolve: (parent, args) => {
        const { storyAccessToken, storyPage, storyPageSize } = args
        const skip = storyPageSize * (Number(storyPage) - 1)
        return storyAccessToken && isSafe(storyAccessToken, `${parent.id}`)
          ? prisma.story.findMany({
              skip,
              take: storyPageSize,
              orderBy: { created_at: "desc" },
              where: {
                user_id: `${parent.id}`,
              },
            })
          : prisma.story.findMany({
              skip,
              take: storyPageSize,
              orderBy: { created_at: "desc" },
              where: {
                user_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
    t.list.field("reviews", {
      type: "Review",
      args: reviewArgs,
      resolve: (parent, args) => {
        const { reviewAccessToken, reviewPage, reviewPageSize } = args
        const skip = reviewPageSize * (Number(reviewPage) - 1)
        return reviewAccessToken && isSafe(reviewAccessToken, `${parent.id}`)
          ? prisma.review.findMany({
              skip,
              take: reviewPageSize,
              orderBy: { created_at: "desc" },
              where: {
                user_id: `${parent.id}`,
              },
            })
          : prisma.review.findMany({
              skip,
              take: reviewPageSize,
              orderBy: { created_at: "desc" },
              where: {
                user_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
    t.list.field("follows", {
      type: "Follow",
      resolve: parent =>
        parent.id
          ? prisma.follow.findMany({
              where: {
                user_id: parent.id,
              },
            })
          : [],
    })
    t.list.field("favorites", {
      type: "Favorite",
      resolve: parent =>
        parent.id
          ? prisma.favorite.findMany({
              where: {
                user_id: parent.id,
              },
            })
          : [],
    })
  },
})

export { User }
