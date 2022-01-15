import { intArg, nonNull, nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const chapterArgs = {
  chapterAccessToken: nullable(stringArg()),
  chapterUserId: nullable(stringArg()),
  page: nonNull(intArg()),
  chapterPageSize: nonNull(intArg()),
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
      resolve: (parent, args) => {
        const { chapterAccessToken, chapterPageSize, chapterUserId, page } =
          args
        const skip = chapterPageSize * (page - 1)
        return chapterAccessToken &&
          chapterUserId &&
          isSafe(chapterAccessToken, chapterUserId)
          ? prisma.chapter.findMany({
              skip,
              take: chapterPageSize,
              orderBy: { created_at: "desc" },
              where: {
                episode_id: `${parent.id}`,
              },
            })
          : prisma.chapter.findMany({
              skip,
              take: chapterPageSize,

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
      resolve: parent =>
        parent.season_id
          ? prisma.season.findUnique({
              where: {
                id: parent.season_id,
              },
            })
          : null,
    })
  },
})

export { Episode }
