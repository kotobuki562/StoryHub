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

        return pageAccessToken &&
          pageUserId &&
          isSafe(pageAccessToken, pageUserId)
          ? await prisma.chapter
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .pages({
                orderBy: { created_at: "asc" },
              })
          : await prisma.chapter
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .pages({
                orderBy: { created_at: "asc" },
              })
      },
    })
    t.field("episode", {
      type: "Episode",
      resolve: async parent => {
        return await prisma.chapter
          .findUnique({
            where: {
              id: parent.episode_id || undefined,
            },
          })
          .episode()
      },
    })
  },
})

export { Chapter }
