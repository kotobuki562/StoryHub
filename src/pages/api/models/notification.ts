import { objectType } from "nexus"
import prisma from "src/lib/prisma"

export const Notification = objectType({
  name: "Notification",
  definition(t) {
    t.nonNull.id("id")
    t.string("notification_title")
    t.nonNull.boolean("is_read")
    t.nonNull.string("user_id")
    t.nonNull.string("receiver_id")
    t.string("review_id")
    t.string("favorite_id")
    t.string("follow_id")
    t.nonNull.date("created_at")
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
