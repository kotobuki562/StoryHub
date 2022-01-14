import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Review = objectType({
  name: "Review",
  definition(t) {
    t.id("id")
    t.string("user_id")
    t.string("story_id")
    t.string("review_title")
    t.string("review_body")
    t.int("stars")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
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
        return parent.story_id
          ? prisma.story.findUnique({
              where: { id: parent.story_id },
            })
          : null
      },
    })
  },
})

export { Review }
