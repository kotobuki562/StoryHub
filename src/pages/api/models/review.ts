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
      resolve: parent => {
        return parent.user_id
          ? prisma.user.findUnique({
              where: { id: parent.user_id },
            })
          : null
      },
    })
    t.field("story", {
      type: "Story",
      resolve: parent => {
        return parent.story_id
          ? prisma.story.findUnique({
              where: { id: parent.story_id },
            })
          : null
      },
    })
    t.list.field("notifications", {
      type: "Notification",
      resolve: parent => {
        return prisma.notification.findMany({
          where: {
            review_id: `${parent.id}`,
          },
        })
      },
    })
  },
})

export { Review }
