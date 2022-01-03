import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Chapter = objectType({
  name: "Chapter",
  definition(t) {
    t.id("id")
    t.string("episode_id")
    t.string("chapter_title")
    t.string("chapter_image")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("pages", {
      type: "Page",
      resolve: (parent, args, ctx) => {
        return prisma.page.findMany({
          where: {
            chapter_id: parent.id,
          },
        })
      },
    })
    t.field("episode", {
      type: "Episode",
      resolve: (parent, args, ctx) => {
        return prisma.episode.findUnique({
          where: {
            id: `${parent.episode_id}`,
          },
        })
      },
    })
  },
})

export { Chapter }
