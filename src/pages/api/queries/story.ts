import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
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
    resolve: async (_parent, args, context) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const stories = await context.prisma.story.findMany({
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
}

const QueryMyStories = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryMyStories", {
    type: "Story",
    args: {
      ...storyArgs,
      ...authArgs,
    },
    resolve: async (_parent, args, context) => {
      return isSafe(args.accessToken, args.userId)
        ? await context.prisma.story.findMany({
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
}

const QueryStoryById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryStoryById", {
    type: "Story",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_parent, args, context) => {
      return await context.prisma.story.findUnique({
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
    resolve: async (_parent, args, context) => {
      return isSafe(args.accessToken, args.userId)
        ? await context.prisma.story.findUnique({
            where: { id: args.id },
          })
        : null
    },
  })
}

const QueryStoriesCountByPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryStoriesCountByPublish", {
    type: "Int",
    resolve: async (_parent, _args, context) => {
      return await context.prisma.story.count({
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
