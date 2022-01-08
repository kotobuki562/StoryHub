import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Story = objectType({
  name: "Story",
  definition(t) {
    t.id("id")
    t.string("user_id")
    t.string("story_title")
    t.string("story_synopsis")
    t.string("story_image")
    // t.string("story_categories")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("seasons", {
      type: "Season",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.season.findMany({
              where: {
                story_id: parent.id,
              },
            })
          : []
      },
    })
    t.list.field("reviews", {
      type: "Review",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.review.findMany({
              where: {
                story_id: parent.id,
              },
            })
          : []
      },
    })
    t.list.field("favorites", {
      type: "Favorite",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.favorite.findMany({
              where: {
                story_id: parent.id,
              },
            })
          : []
      },
    })
    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        return prisma.user.findUnique({
          where: {
            id: `${parent.user_id}`,
          },
        })
      },
    })
  },
})

export { Story }
