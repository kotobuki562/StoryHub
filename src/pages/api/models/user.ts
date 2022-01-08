import { objectType } from "nexus"
import prisma from "src/lib/prisma"

// model User {
//   id         String     @id @unique @default(uuid())
//   user_name  String?
//   user_deal  String?
//   links      Json?
//   image      String?
//   created_at DateTime   @default(now())
//   updated_at DateTime?
//   stories    Story[]
//   reviews    Review[]
//   follows    Follow[]
//   favorites  Favorite[]
//   categories Category[]
// }

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id")
    t.string("user_name")
    t.string("user_deal")
    // t.string("links")
    t.string("image")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("stories", {
      type: "Story",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.story.findMany({
              where: {
                user_id: parent.id,
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
                user_id: parent.id,
              },
            })
          : []
      },
    })
    t.list.field("follows", {
      type: "Follow",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.follow.findMany({
              where: {
                user_id: parent.id,
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
                user_id: parent.id,
              },
            })
          : []
      },
    })
    t.list.field("categories", {
      type: "Category",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.category.findMany({
              where: {
                user_id: parent.id,
              },
            })
          : []
      },
    })
  },
})

export { User }
