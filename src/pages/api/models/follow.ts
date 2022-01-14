import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Follow = objectType({
  name: "Follow",
  definition(t) {
    t.int("id")
    t.string("user_id")
    t.string("follow_id")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        return parent.user_id
          ? prisma.user.findUnique({
              where: { id: parent.user_id },
            })
          : null
      },
    })
  },
})

export { Follow }
