import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, isSafe } from "src/pages/api/index.page"

const seasonArgs = {
  searchTitle: nullable(stringArg()),
  searchUserId: nullable(stringArg()),
  searchCategory: nullable(stringArg()),
}

const QuerySeasons = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QuerySeasons", {
    type: "Season",
    args: {
      ...seasonArgs,
    },
    resolve: async (_parent, args) => {
      const seasons = await prisma.season.findMany({
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            season_title: { search: args.searchTitle },
          }),
          ...(args.searchUserId && { user_id: args.searchUserId }),
          publish: true,
        },
      })
      return seasons
    },
  })
}

const QueryMySeasons = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryMySeasons", {
    type: "Season",
    args: {
      ...seasonArgs,
      ...authArgs,
    },
    resolve: (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? prisma.season.findMany({
            orderBy: { created_at: "desc" },
            where: {
              ...(args.searchTitle && {
                season_title: { search: args.searchTitle },
              }),
              ...(args.searchUserId && { user_id: args.searchUserId }),
            },
          })
        : null
    },
  })
}

const QuerySeasonById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QuerySeasonById", {
    type: "Season",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.season.findUnique({
        where: {
          id: args.id,
        },
      })
    },
  })
}

const QueryMySeasonById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryMySeasonById", {
    type: "Season",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? prisma.season.findUnique({
            where: {
              id: args.id,
            },
          })
        : null
    },
  })
}

const QuerySeasonsCountByPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QuerySeasonsCountByPublish", {
    type: "Int",
    resolve: (_parent, _args) => {
      return prisma.season.count({
        where: {
          publish: true,
        },
      })
    },
  })
}

const QuerySeasonsCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QuerySeasonsCountByUnPublish", {
    type: "Int",
    resolve: (_parent, _args) => {
      return prisma.season.count({
        where: {
          publish: false,
        },
      })
    },
  })
}

export {
  QueryMySeasonById,
  QueryMySeasons,
  QuerySeasonById,
  QuerySeasons,
  QuerySeasonsCountByPublish,
  QuerySeasonsCountByUnPublish,
}
