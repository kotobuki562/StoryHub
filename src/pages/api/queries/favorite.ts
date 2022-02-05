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
    resolve: (_parent, args) => {
      return prisma.favorite.findMany({
        orderBy: { created_at: "desc" },
        where: {
          user_id: args.userId,
        },
      })
    },
  })
}

const QueryFavoritesByStory = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryFavoritesByStory", {
    type: "Favorite",
    args: {
      storyId: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.favorite.findMany({
        orderBy: { created_at: "desc" },
        where: {
          story_id: args.storyId,
        },
      })
    },
  })
}

const QueryMyFavoritesByUser = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryMyFavoritesByUser", {
    type: "Favorite",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.favorite.findMany({
        orderBy: { created_at: "desc" },
        where: {
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      })
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
    resolve: (_parent, args) => {
      return prisma.favorite.findMany({
        orderBy: { created_at: "desc" },
        where: {
          story_id: args.storyId,
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      })
    },
  })
}

export {
  QueryFavoritesByStory,
  QueryFavoritesByUser,
  QueryMyFavoritesByStory,
  QueryMyFavoritesByUser,
}
