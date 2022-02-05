import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Favorite = objectType({
  name: "Favorite",
  definition(t) {
    t.string("id")
    t.string("user_id")
    t.string("story_id")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: parent => {
        return prisma.user.findUnique({
          where: { id: `${parent.user_id}` },
        })
      },
    })
    t.field("story", {
      type: "Story",
      resolve: parent => {
        return prisma.story.findUnique({
          where: { id: `${parent.story_id}` },
        })
      },
    })
    t.list.field("notifications", {
      type: "Notification",
      resolve: parent => {
        return prisma.notification.findMany({
          where: {
            favorite_id: `${parent.id}`,
          },
        })
      },
    })
  },
})

export { Favorite }
