import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, defaultArgs, isSafe } from "src/pages/api/index.page"

const storyArgs = {
  searchTitle: nullable(stringArg()),
  searchUserId: nullable(stringArg()),
  searchCategory: nullable(stringArg()),
}

const QueryStories = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryStories", {
    type: "Story",
    args: {
      ...storyArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const stories = await prisma.story.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            story_title: { search: args.searchTitle },
          }),
          ...(args.searchUserId && { user_id: args.searchUserId }),
          ...(args.searchCategory && {
            story_categories: {
              has: args.searchCategory,
            },
          }),
          publish: true,
        },
      })
      return stories
    },
  })

const QueryMyStories = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryMyStories", {
    type: "Story",
    args: {
      ...storyArgs,
      ...authArgs,
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      return isSafe(args.accessToken, args.userId)
        ? prisma.story.findMany({
            skip,
            take: pageSize,
            orderBy: { created_at: "desc" },
            where: {
              ...(args.searchTitle && {
                story_title: { search: args.searchTitle },
              }),
              ...(args.searchUserId && { user_id: args.searchUserId }),
              ...(args.searchCategory && {
                story_categories: {
                  has: args.searchCategory,
                },
              }),
              user_id: args.userId,
            },
          })
        : null
    },
  })

const QueryStoryById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryStoryById", {
    type: "Story",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) =>
      prisma.story.findUnique({
        where: { id: args.id },
      }),
  })

const QueryMyStoryById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryMyStoryById", {
    type: "Story",
    args: {
      id: nonNull(stringArg()),
      userId: nonNull(stringArg()),
      accessToken: nonNull(stringArg()),
    },
    resolve: (_parent, args) =>
      isSafe(args.accessToken, args.userId)
        ? prisma.story.findUnique({
            where: { id: args.id },
          })
        : null,
  })

const QueryStoriesCountByPublish = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryStoriesCountByPublish", {
    type: "Int",
    resolve: (_parent, _args) =>
      prisma.story.count({
        where: {
          publish: true,
        },
      }),
  })

const QueryStoriesCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryStoriesCountByUnPublish", {
    type: "Int",
    resolve: (_parent, _args) =>
      prisma.story.count({
        where: {
          publish: false,
        },
      }),
  })

export {
  QueryMyStories,
  QueryMyStoryById,
  QueryStories,
  QueryStoriesCountByPublish,
  QueryStoriesCountByUnPublish,
  QueryStoryById,
}
