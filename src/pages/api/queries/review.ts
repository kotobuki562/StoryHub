import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, decodeUserId, isSafe } from "src/pages/api/index.page"

const reviewArgs = {
  searchTitle: nullable(stringArg()),
  serchUserId: nullable(stringArg()),
}

const QueryReviews = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryReviews", {
    type: "Review",
    args: {
      ...reviewArgs,
    },
    resolve: async (_parent, args) => {
      const reviews = await prisma.review.findMany({
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            review_title: { search: args.searchTitle },
          }),
          ...(args.serchUserId && {
            user_id: args.serchUserId,
          }),
        },
      })
      return reviews
    },
  })

const QueryMyReviews = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryMyReviews", {
    type: "Review",
    args: {
      accessToken: nonNull(stringArg()),
      ...reviewArgs,
    },
    resolve: (_parent, args) =>
      prisma.review.findMany({
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            review_title: { search: args.searchTitle },
          }),
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      }),
  })

const QueryReviewById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryReviewById", {
    type: "Review",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_parent, { id }) => {
      const review = await prisma.review.findUnique({
        where: {
          id,
        },
      })
      return review
    },
  })

const QueryMyReviewById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryMyReviewById", {
    type: "Review",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: async (_parent, { accessToken, id, userId }) => {
      const review = await prisma.review.findUnique({
        where: {
          id,
        },
      })
      return isSafe(accessToken, userId) ? review : null
    },
  })

const QueryReviewsCount = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryReviewsCount", {
    type: "Int",
    resolve: async (_parent, _args) => {
      const count = await prisma.review.count()
      return count
    },
  })

export {
  QueryMyReviewById,
  QueryMyReviews,
  QueryReviewById,
  QueryReviews,
  QueryReviewsCount,
}
