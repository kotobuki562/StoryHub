import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, defaultArgs, isSafe } from "src/pages/api/index.page"

const episodeArgs = {
  searchTitle: nullable(stringArg()),
  serchSeasonId: nullable(stringArg()),
}

const QueryEpisodes = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryEpisodes", {
    type: "Episode",
    args: {
      ...episodeArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const seasons = await prisma.episode.findMany({
        skip,
        take: pageSize,
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

const QueryMyEpisodes = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryMyEpisodes", {
    type: "Episode",
    args: {
      ...episodeArgs,
      ...authArgs,
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      return isSafe(args.accessToken, args.userId)
        ? prisma.episode.findMany({
            skip,
            take: pageSize,
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

const QueryEpisodeById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryEpisodeById", {
    type: "Episode",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) =>
      prisma.episode.findUnique({
        where: {
          id: args.id,
        },
        select: {
          publish: true,
        },
      }),
  })

const QueryMyEpisodeById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryMyEpisodeById", {
    type: "Episode",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
      ...defaultArgs,
    },
    resolve: (_parent, args) =>
      isSafe(args.accessToken, args.userId)
        ? prisma.episode.findUnique({
            where: {
              id: args.id,
            },
          })
        : null,
  })

const QueryEpisodesCountByPublish = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryEpisodesCountByPublish", {
    type: "Int",
    resolve: (_parent, _args) =>
      prisma.episode.count({
        where: {
          publish: true,
        },
      }),
  })

const QueryEpisodesCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryEpisodesCountByUnPublish", {
    type: "Int",
    resolve: (_parent, _args) =>
      prisma.episode.count({
        where: {
          publish: false,
        },
      }),
  })

export {
  QueryEpisodeById,
  QueryEpisodes,
  QueryEpisodesCountByPublish,
  QueryEpisodesCountByUnPublish,
  QueryMyEpisodeById,
  QueryMyEpisodes,
}
