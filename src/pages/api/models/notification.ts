import { objectType } from "nexus"
import prisma from "src/lib/prisma"

// model Notification {
//   id          String    @id @unique @default(uuid())
//   user_id     String
//   receiver_id String
//   story_id    String?
//   review_id   String?
//   favorite_id String?
//   follow_id   String?
//   created_at  DateTime  @default(now())
//   user        User?     @relation(fields: [user_id], references: [id])
//   story       Story?    @relation(fields: [story_id], references: [id])
//   review      Review?   @relation(fields: [review_id], references: [id])
//   favorite    Favorite? @relation(fields: [favorite_id], references: [id])
//   follow      Follow?   @relation(fields: [follow_id], references: [id])
// }

export const Notification = objectType({
  name: "Notification",
  definition(t) {
    t.id("id")
    t.string("user_id")
    t.string("receiver_id")
    t.string("review_id")
    t.string("favorite_id")
    t.string("follow_id")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: parent => {
        return prisma.user.findUnique({
          where: {
            id: `${parent.user_id}`,
          },
        })
      },
    })
    t.field("review", {
      type: "Review",
      resolve: parent => {
        return prisma.review.findUnique({
          where: {
            id: `${parent.review_id}`,
          },
        })
      },
    })
    t.field("favorite", {
      type: "Favorite",
      resolve: parent => {
        return prisma.favorite.findUnique({
          where: {
            id: `${parent.favorite_id}`,
          },
        })
      },
    })
    t.field("follow", {
      type: "Follow",
      resolve: parent => {
        return prisma.follow.findUnique({
          where: {
            id: `${parent.follow_id}`,
          },
        })
      },
    })
  },
})
