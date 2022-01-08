import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Season = objectType({
  name: "Season",
  definition(t) {
    t.id("id")
    t.string("story_id")
    t.string("season_title")
    t.string("season_image")
    t.string("season_synopsis")
    // t.string("season_categories")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("episodes", {
      type: "Episode",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.episode.findMany({
              where: {
                season_id: parent.id,
              },
            })
          : []
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
