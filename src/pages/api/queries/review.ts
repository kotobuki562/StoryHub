import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import {
  authArgs,
  decodeUserId,
  defaultArgs,
  isSafe,
} from "src/pages/api/index.page"

const reviewArgs = {
  searchTitle: nullable(stringArg()),
  serchUserId: nullable(stringArg()),
}

const QueryReviews = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryReviews", {
    type: "Review",
    args: {
      ...reviewArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const reviews = await prisma.review.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            review_title: { search: args.searchTitle },
          }),
          ...(args.serchUserId && {
            user_id: args.serchUserId,
          }),
          publish: true,
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
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      return prisma.review.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            review_title: { search: args.searchTitle },
          }),
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      })
    },
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

const QueryPublishReviewsCount = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryPublishReviewsCount", {
    type: "Int",
    resolve: async (_parent, _args) => {
      const count = await prisma.review.count({
        where: {
          publish: true,
        },
      })
      return count
    },
  })

const QueryUnPublishReviewsCount = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryUnPublishReviewsCount", {
    type: "Int",
    resolve: async (_parent, _args) => {
      const count = await prisma.review.count({
        where: {
          publish: false,
        },
      })
      return count
    },
  })

export {
  QueryMyReviewById,
  QueryMyReviews,
  QueryPublishReviewsCount,
  QueryReviewById,
  QueryReviews,
  QueryUnPublishReviewsCount,
}
