import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { decodeUserId, defaultArgs } from "src/pages/api/index.page"

const QueryFavoritesByUser = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryFavoritesByUser", {
    type: "Favorite",
    args: {
      ...defaultArgs,
      userId: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const favorites = await prisma.favorite.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          user_id: args.userId,
        },
      })
      return favorites
    },
  })
}

const QueryFavoritesByStory = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryFavoritesByStory", {
    type: "Favorite",
    args: {
      ...defaultArgs,
      storyId: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const favorites = await prisma.favorite.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          story_id: args.storyId,
        },
      })
      return favorites
    },
  })
}

const QueryMyFavoritesByUser = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryMyFavoritesByUser", {
    type: "Favorite",
    args: {
      accessToken: nonNull(stringArg()),
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const favorites = await prisma.favorite.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      })
      return favorites
    },
  })
}

const QueryMyFavoritesByStory = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryMyFavoritesByStory", {
    type: "Favorite",
    args: {
      accessToken: nonNull(stringArg()),
      storyId: nonNull(stringArg()),
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const favorites = await prisma.favorite.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          story_id: args.storyId,
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      })
      return favorites
    },
  })
}

export {
  QueryFavoritesByStory,
  QueryFavoritesByUser,
  QueryMyFavoritesByStory,
  QueryMyFavoritesByUser,
}