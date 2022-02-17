import { nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const chapterArgs = {
  chapterAccessToken: nullable(stringArg()),
  chapterUserId: nullable(stringArg()),
}

const Episode = objectType({
  name: "Episode",
  definition(t) {
    t.id("id")
    t.string("season_id")
    t.string("episode_title")
    t.string("episode_image")
    t.string("episode_synopsis")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("chapters", {
      type: "Chapter",
      args: chapterArgs,
      resolve: async (parent, args) => {
        const { chapterAccessToken, chapterUserId } = args
        return chapterAccessToken &&
          chapterUserId &&
          isSafe(chapterAccessToken, chapterUserId)
          ? await prisma.episode
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .chapters({
                orderBy: { created_at: "asc" },
              })
          : await prisma.episode
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .chapters({
                orderBy: { created_at: "asc" },
                where: { publish: true },
              })
      },
    })
    t.field("season", {
      type: "Season",
      resolve: async parent => {
        return await prisma.episode
          .findUnique({
            where: {
              id: parent.season_id || undefined,
            },
          })
          .season()
      },
    })
  },
})

export { Episode }
