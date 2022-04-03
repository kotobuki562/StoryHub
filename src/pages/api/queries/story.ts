import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, defaultArgs, isSafe } from "src/pages/api/index.page"

const storyArgs = {
  searchTitle: nullable(stringArg()),
  searchUserId: nullable(stringArg()),
  searchCategory: nullable(stringArg()),
}

const QueryStories = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryStories", {
    type: "Story",
    args: {
      ...storyArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const users = await prisma.user.findMany({
        select: { id: true },
      })
      const userIds = users.map(user => {
        return user.id
      })
      return await prisma.story.findMany({
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
          user_id: {
            in: userIds,
          },
        },
      })
    },
  })
}

const QueryMyStories = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryMyStories", {
    type: "Story",
    args: {
      ...storyArgs,
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? await prisma.user
            .findUnique({
              where: { id: args.userId },
            })
            .stories({
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
              },
            })
        : null
    },
  })
}

const QueryStoryById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryStoryById", {
    type: "Story",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      return await prisma.story.findUnique({
        where: { id: args.id },
      })
    },
  })
}

const QueryMyStoryById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryMyStoryById", {
    type: "Story",
    args: {
      id: nonNull(stringArg()),
      userId: nonNull(stringArg()),
      accessToken: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? await prisma.story.findUnique({
            where: { id: args.id },
          })
        : null
    },
  })
}

const QueryStoriesCountByPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryStoriesCountByPublish", {
    type: "Int",
    resolve: async (_parent, _args) => {
      return await prisma.story.count({
        where: {
          publish: true,
        },
      })
    },
  })
}

const QueryStoriesCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryStoriesCountByUnPublish", {
    type: "Int",
    resolve: async (_parent, _args, context) => {
      return await context.prisma.story.count({
        where: {
          publish: false,
        },
      })
    },
  })
}

export {
  QueryMyStories,
  QueryMyStoryById,
  QueryStories,
  QueryStoriesCountByPublish,
  QueryStoriesCountByUnPublish,
  QueryStoryById,
}
