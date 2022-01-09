import { intArg, nonNull, objectType, stringArg, nullable } from "nexus"
import prisma from "src/lib/prisma"
import { isSafe } from "../index.page"

const episodeArgs = {
  episodeAccessToken: nullable(stringArg()),
  episodeUserId: nullable(stringArg()),
  episodePage: nonNull(intArg()),
  episodePageSize: nonNull(intArg()),
}

const Season = objectType({
  name: "Season",
  definition(t) {
    t.id("id")
    t.string("story_id")
    t.string("season_title")
    t.string("season_image")
    t.string("season_synopsis")
    t.list.string("season_categories")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("episodes", {
      type: "Episode",
      args: episodeArgs,
      resolve: (parent, args, ctx) => {
        const {
          episodeAccessToken,
          episodeUserId,
          episodePage,
          episodePageSize,
        } = args
        const skip = episodePageSize * (episodePage - 1)
        return episodeAccessToken &&
          episodeUserId &&
          isSafe(episodeAccessToken, episodeUserId)
          ? prisma.episode.findMany({
              skip,
              take: episodePageSize,
              orderBy: { created_at: "desc" },
              where: {
                season_id: `${parent.id}`,
              },
            })
          : prisma.episode.findMany({
              skip,
              take: episodePageSize,
              orderBy: { created_at: "desc" },
              where: {
                season_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
    t.field("story", {
      type: "Story",
      resolve: (parent, args, ctx) => {
        return prisma.story.findUnique({
          where: {
            id: `${parent.story_id}`,
          },
        })
      },
    })
  },
})

export { Season }
