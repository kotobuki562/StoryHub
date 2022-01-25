import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { intArg, nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, decodeUserId, isSafe } from "src/pages/api/index.page"

const reviewArgs = {
  searchTitle: nullable(stringArg()),
  serchUserId: nullable(stringArg()),
  page: nullable(intArg()),
  pageSize: nullable(intArg()),
}

const QueryReviews = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryReviews", {
    type: "Review",
    args: {
      ...reviewArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize && page ? pageSize * (Number(page) - 1) : undefined
      const take = pageSize && page ? pageSize : undefined
      const reviews = await prisma.review.findMany({
        skip,
        take,
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

const QueryReviewsByStoryId = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryReviewsByStoryId", {
    type: "Review",
    args: {
      storyId: nonNull(stringArg()),
      ...reviewArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize, storyId } = args
      const reviews = await prisma.review.findMany({
        skip: pageSize && page ? pageSize * (Number(page) - 1) : undefined,
        take: pageSize && page ? pageSize : undefined,

        orderBy: { created_at: "desc" },
        where: {
          story_id: storyId,
        },
      })
      return reviews
    },
  })

const QueryReviewsCountByStoryId = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryReviewsCountByStoryId", {
    type: "Int",
    args: {
      storyId: nonNull(stringArg()),
    },
    resolve: async (_parent, { storyId }) => {
      const count = await prisma.review.count({
        where: {
          story_id: storyId,
        },
      })
      return count
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
  QueryReviewsByStoryId,
  QueryReviewsCount,
  QueryReviewsCountByStoryId,
}
