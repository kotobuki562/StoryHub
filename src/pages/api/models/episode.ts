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
          ? await prisma.chapter.findMany({
              orderBy: { created_at: "desc" },
              where: {
                episode_id: `${parent.id}`,
              },
            })
          : await prisma.chapter.findMany({
              orderBy: { created_at: "desc" },
              where: {
                episode_id: `${parent.id}`,
                publish: true,
              },
            })
      },
    })
    t.field("season", {
      type: "Season",
      resolve: async parent => {
        return parent.season_id
          ? await prisma.season.findUnique({
              where: {
                id: parent.season_id,
              },
            })
          : null
      },
    })
  },
})

export { Episode }
