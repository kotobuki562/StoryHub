import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Category = objectType({
  name: "Category",
  definition(t) {
    t.int("id")
    t.nullable.string("user_id")
    t.nullable.string("category_title")
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

export { Category }
