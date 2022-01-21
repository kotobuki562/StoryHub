import { nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const pageArgs = {
  pageAccessToken: nullable(stringArg()),
  pageUserId: nullable(stringArg()),
}

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
      args: pageArgs,
      resolve: (parent, args) => {
        const { pageAccessToken, pageUserId } = args

        if (
          pageAccessToken &&
          pageUserId &&
          isSafe(pageAccessToken, pageUserId)
        ) {
          return prisma.page.findMany({
            orderBy: { created_at: "asc" },
            where: {
              chapter_id: `${parent.id}`,
            },
          })
        }
        return parent.publish
          ? prisma.page.findMany({
              orderBy: { created_at: "asc" },
              where: {
                chapter_id: `${parent.id}`,
              },
            })
          : []
      },
    })
    t.field("episode", {
      type: "Episode",
      resolve: parent =>
        parent.episode_id
          ? prisma.episode.findUnique({
              where: {
                id: parent.episode_id,
              },
            })
          : null,
    })
  },
})

export { Chapter }
