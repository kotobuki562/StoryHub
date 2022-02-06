import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Follow = objectType({
  name: "Follow",
  definition(t) {
    t.string("id")
    t.string("user_id")
    t.string("follow_id")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: async parent => {
        return await prisma.user.findUnique({
          where: { id: `${parent.user_id}` },
        })
      },
    })
    t.list.field("notifications", {
      type: "Notification",
      resolve: async parent => {
        return await prisma.notification.findMany({
          where: {
            follow_id: `${parent.id}`,
          },
        })
      },
    })
  },
})

export { Follow }
