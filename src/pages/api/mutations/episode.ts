import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { booleanArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { isSafe } from "src/pages/api/index.page"

const createEpisode = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("createEpisode", {
    type: "Episode",
    args: {
      episodeTitle: nonNull(stringArg()),
      episodeSynopsis: nonNull(stringArg()),
      episodeImage: nullable(stringArg()),
      publish: nonNull(booleanArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: async (_, args, _ctx) => {
      const story = isSafe(args.acessToken, args.userId)
        ? await prisma.episode.create({
            data: {
              episode_title: args.episodeTitle,
              episode_synopsis: args.episodeSynopsis,
              episode_image: args.episodeImage,
              publish: args.publish,
            },
          })
        : null
      return story
    },
  })
}

const updateEpisode = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateEpisode", {
    type: "Episode",
    args: {
      episodeId: nonNull(stringArg()),
      episodeTitle: nonNull(stringArg()),
      episodeSynopsis: nonNull(stringArg()),
      episodeImage: nullable(stringArg()),
      publish: nonNull(booleanArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: async (_, args, _ctx) => {
      const story = isSafe(args.acessToken, args.userId)
        ? await prisma.episode.update({
            where: {
              id: args.episodeId,
            },
            data: {
              episode_title: args.episodeTitle,
              episode_synopsis: args.episodeSynopsis,
              episode_image: args.episodeImage,
              publish: args.publish,
              updated_at: new Date(),
            },
          })
        : null
      return story
    },
  })
}

const deleteEpisode = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteEpisode", {
    type: "Episode",
    args: {
      episodeId: nonNull(stringArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: async (_, args, _ctx) => {
      const story = isSafe(args.acessToken, args.userId)
        ? await prisma.episode.delete({
            where: {
              id: args.episodeId,
            },
          })
        : null
      return story
    },
  })
}

export { createEpisode, deleteEpisode, updateEpisode }
