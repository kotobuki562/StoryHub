import { objectType } from "nexus"
import prisma from "src/lib/prisma"

export const Notification = objectType({
  name: "Notification",
  definition(t) {
    t.id("id")
    t.string("user_id")
    t.string("receiver_id")
    t.string("review_id")
    t.string("favorite_id")
    t.string("follow_id")
    t.date("created_at")
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
    t.field("receiver", {
      type: "User",
      resolve: async parent => {
        return await prisma.user.findUnique({
          where: {
            id: `${parent.receiver_id}`,
          },
        })
      },
    })
    t.field("review", {
      type: "Review",
      resolve: async parent => {
        return await prisma.review.findUnique({
          where: {
            id: `${parent.review_id}`,
          },
        })
      },
    })
    t.field("favorite", {
      type: "Favorite",
      resolve: async parent => {
        return await prisma.favorite.findUnique({
          where: {
            id: `${parent.favorite_id}`,
          },
        })
      },
    })
    t.field("follow", {
      type: "Follow",
      resolve: async parent => {
        return await prisma.follow.findUnique({
          where: {
            id: `${parent.follow_id}`,
          },
        })
      },
    })
  },
})
