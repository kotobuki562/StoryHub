import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { booleanArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { isSafe } from "src/pages/api/index.page"

const createSeason = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("createSeason", {
    type: "Season",
    args: {
      storyId: nonNull(stringArg()),
      seasonTitle: nonNull(stringArg()),
      seasonSynopsis: nonNull(stringArg()),
      seasonImage: nullable(stringArg()),
      publish: nonNull(booleanArg()),
      acessToken: nonNull(stringArg()),
    },
    resolve: async (_, args, _ctx) => {
      return await prisma.season.create({
        data: {
          story_id: args.storyId,
          season_title: args.seasonTitle,
          season_synopsis: args.seasonSynopsis,
          season_image: args.seasonImage,
          publish: args.publish,
        },
      })
    },
  })
}

const updateSeason = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateSeason", {
    type: "Season",
    args: {
      seasonId: nonNull(stringArg()),
      storyId: nonNull(stringArg()),
      seasonTitle: nonNull(stringArg()),
      seasonSynopsis: nonNull(stringArg()),
      seasonImage: nullable(stringArg()),
      publish: nonNull(booleanArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: async (_, args) => {
      return isSafe(args.acessToken, args.userId)
        ? await prisma.season.update({
            where: {
              id: `${args.seasonId}`,
            },
            data: {
              story_id: args.storyId,
              season_title: args.seasonTitle,
              season_synopsis: args.seasonSynopsis,
              season_image: args.seasonImage,
              publish: args.publish,
              updated_at: new Date(),
            },
          })
        : null
    },
  })
}

const deleteSeason = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteSeason", {
    type: "Season",
    args: {
      seasonId: nonNull(stringArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: async (_, args) => {
      return isSafe(args.acessToken, args.userId)
        ? await prisma.season.delete({
            where: {
              id: `${args.seasonId}`,
            },
          })
        : null
    },
  })
}

export { createSeason, deleteSeason, updateSeason }
