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
      resolve: async (parent, args) => {
        const { pageAccessToken, pageUserId } = args

        if (
          pageAccessToken &&
          pageUserId &&
          isSafe(pageAccessToken, pageUserId)
        ) {
          return await prisma.page.findMany({
            orderBy: { created_at: "asc" },
            where: {
              chapter_id: `${parent.id}`,
            },
          })
        }
        return (await parent.publish)
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
      resolve: async parent => {
        return parent.episode_id
          ? await prisma.episode.findUnique({
              where: {
                id: parent.episode_id,
              },
            })
          : null
      },
    })
  },
})

export { Chapter }
