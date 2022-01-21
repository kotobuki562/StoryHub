import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { decodeUserId } from "src/pages/api/index.page"

const QueryFavoritesByUser = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryFavoritesByUser", {
    type: "Favorite",
    args: {
      userId: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const favorites = await prisma.favorite.findMany({
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
      storyId: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const favorites = await prisma.favorite.findMany({
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
    },
    resolve: async (_parent, args) => {
      const favorites = await prisma.favorite.findMany({
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
    },
    resolve: async (_parent, args) => {
      const favorites = await prisma.favorite.findMany({
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
