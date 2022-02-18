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
      resolve: async parent => {
        return await prisma.favorite
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .user()
      },
    })
    t.field("story", {
      type: "Story",
      resolve: async parent => {
        return await prisma.favorite
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .story()
      },
    })
    t.list.field("notifications", {
      type: "Notification",
      resolve: async parent => {
        return await prisma.favorite
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .notifications()
      },
    })
  },
})

export { Favorite }
