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
        return await prisma.notification
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .user()
      },
    })
    t.field("receiver", {
      type: "User",
      resolve: async parent => {
        return await prisma.notification
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .user()
      },
    })
    t.field("review", {
      type: "Review",
      resolve: async parent => {
        return await prisma.notification
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .review()
      },
    })
    t.field("favorite", {
      type: "Favorite",
      resolve: async parent => {
        return await prisma.notification
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .favorite()
      },
    })
    t.field("follow", {
      type: "Follow",
      resolve: async parent => {
        return await prisma.notification
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .follow()
      },
    })
  },
})
