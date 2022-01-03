import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Favorite = objectType({
  name: "Favorite",
  definition(t) {
    t.int("id")
    t.string("user_id")
    t.string("story_id")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        return prisma.user.findUnique({
          where: { id: `${parent.user_id}` },
        })
      },
    })
    t.field("story", {
      type: "Story",
      resolve: (parent, args, ctx) => {
        return prisma.story.findUnique({
          where: { id: `${parent.story_id}` },
        })
      },
    })
  },
})

export { Favorite }
