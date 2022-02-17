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
    t.date("created_at")
    t.nullable.date("updated_at")
    t.field("user", {
      type: "User",
      resolve: async parent => {
        return await prisma.review
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .user()
      },
    })
    t.field("story", {
      type: "Story",
      resolve: async parent => {
        return await prisma.review.findUnique({
          where: { id: parent.id || undefined },
        })
      },
    })
    t.list.field("notifications", {
      type: "Notification",
      resolve: async parent => {
        return await prisma.review
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .Notification()
      },
    })
  },
})

export { Review }
