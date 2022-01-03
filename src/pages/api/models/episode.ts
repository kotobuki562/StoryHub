import { objectType } from "nexus"
import prisma from "src/lib/prisma"

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
      resolve: (parent, args, ctx) => {
        return prisma.chapter.findMany({
          where: {
            episode_id: parent.id,
          },
        })
      },
    })
    t.field("season", {
      type: "Season",
      resolve: (parent, args, ctx) => {
        return prisma.season.findUnique({
          where: {
            id: `${parent.season_id}`,
          },
        })
      },
    })
  },
})

export { Episode }
