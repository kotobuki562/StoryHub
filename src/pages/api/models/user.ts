import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id")
    t.string("user_name")
    t.string("user_deal")
    t.string("image")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("stories", {
      type: "Story",
      resolve: (parent, args, ctx) => {
        return prisma.story.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
    t.list.field("categories", {
      type: "Category",
      resolve: (parent, args, ctx) => {
        return prisma.category.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
    t.list.field("favorites", {
      type: "Favorite",
      resolve: (parent, args, ctx) => {
        return prisma.favorite.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
    t.list.field("reviews", {
      type: "Review",
      resolve: (parent, args, ctx) => {
        return prisma.review.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
    t.list.field("follows", {
      type: "Follow",
      resolve: (parent, args, ctx) => {
        return prisma.follow.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
  },
})

export { User }
