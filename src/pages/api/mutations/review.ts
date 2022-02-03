import { intArg, nonNull, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { decodeUserId, isSafe } from "src/pages/api/index.page"

// model Review {
//   id           String    @id @unique @default(uuid())
//   user_id      String
//   story_id     String?
//   review_title String
//   review_body  String
//   stars        Int       @default(0)
//   publish      Boolean   @default(false) @db.Boolean
//   created_at   DateTime  @default(now())
//   updated_at   DateTime?
//   user         User?     @relation(fields: [user_id], references: [id])
//   story        Story?    @relation(fields: [story_id], references: [id])
// }

const createReview = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("createReview", {
    type: "Review",
    args: {
      storyId: nonNull(stringArg()),
      reviewTitle: nonNull(stringArg()),
      reviewBody: nonNull(stringArg()),
      stars: nonNull(intArg()),
      acessToken: nonNull(stringArg()),
    },
    resolve: (_, args, _ctx) => {
      return prisma.review.create({
        data: {
          user_id: `${decodeUserId(args.acessToken)}`,
          story_id: args.storyId,
          review_title: args.reviewTitle,
          review_body: args.reviewBody,
          stars: args.stars,
        },
      })
    },
  })
}

const updateReview = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateReview", {
    type: "Review",
    args: {
      reviewId: nonNull(stringArg()),
      reviewTitle: nonNull(stringArg()),
      reviewBody: nonNull(stringArg()),
      stars: nonNull(intArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: (_, args) => {
      return isSafe(args.acessToken, args.userId)
        ? prisma.review.update({
            where: {
              id: `${args.reviewId}`,
            },
            data: {
              review_title: args.reviewTitle,
              review_body: args.reviewBody,
              stars: args.stars,

              updated_at: new Date(),
            },
          })
        : null
    },
  })
}

const deleteReview = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteReview", {
    type: "Review",
    args: {
      reviewId: nonNull(stringArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: (_, args) => {
      return isSafe(args.acessToken, args.userId)
        ? prisma.review.delete({
            where: {
              id: `${args.reviewId}`,
            },
          })
        : null
    },
  })
}

export { createReview, deleteReview, updateReview }
