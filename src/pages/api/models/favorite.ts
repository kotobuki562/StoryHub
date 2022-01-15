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
      resolve: parent =>
        parent.user_id
          ? prisma.user.findUnique({
              where: { id: parent.user_id },
            })
          : null,
    })
    t.field("story", {
      type: "Story",
      resolve: parent =>
        parent.story_id
          ? prisma.story.findUnique({
              where: { id: parent.story_id },
            })
          : null,
    })
  },
})

export { Favorite }
