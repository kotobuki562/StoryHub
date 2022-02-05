import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, isSafe } from "src/pages/api/index.page"

const episodeArgs = {
  searchTitle: nullable(stringArg()),
  serchSeasonId: nullable(stringArg()),
}

const QueryEpisodes = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryEpisodes", {
    type: "Episode",
    args: {
      ...episodeArgs,
    },
    resolve: async (_parent, args) => {
      const seasons = await prisma.episode.findMany({
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            episode_title: { search: args.searchTitle },
          }),
          ...(args.serchSeasonId && {
            season_id: args.serchSeasonId,
          }),

          publish: true,
        },
      })
      return seasons
    },
  })
}

const QueryMyEpisodes = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryMyEpisodes", {
    type: "Episode",
    args: {
      ...episodeArgs,
      ...authArgs,
    },
    resolve: (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? prisma.episode.findMany({
            orderBy: { created_at: "desc" },
            where: {
              ...(args.searchTitle && {
                episode_title: { search: args.searchTitle },
                ...(args.serchSeasonId && {
                  season_id: args.serchSeasonId,
                }),
              }),
            },
          })
        : null
    },
  })
}

const QueryEpisodeById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryEpisodeById", {
    type: "Episode",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.episode.findUnique({
        where: {
          id: args.id,
        },
      })
    },
  })
}

const QueryMyEpisodeById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryMyEpisodeById", {
    type: "Episode",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? prisma.episode.findUnique({
            where: {
              id: args.id,
            },
          })
        : null
    },
  })
}

const QueryEpisodesCountByPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryEpisodesCountByPublish", {
    type: "Int",
    resolve: (_parent, _args) => {
      return prisma.episode.count({
        where: {
          publish: true,
        },
      })
    },
  })
}

const QueryEpisodesCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryEpisodesCountByUnPublish", {
    type: "Int",
    resolve: (_parent, _args) => {
      return prisma.episode.count({
        where: {
          publish: false,
        },
      })
    },
  })
}

export {
  QueryEpisodeById,
  QueryEpisodes,
  QueryEpisodesCountByPublish,
  QueryEpisodesCountByUnPublish,
  QueryMyEpisodeById,
  QueryMyEpisodes,
}
