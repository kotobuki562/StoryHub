import { intArg, nonNull, nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"
import { isSafe } from "../index.page"

const pageArgs = {
  pageAccessToken: nullable(stringArg()),
  pageUserId: nullable(stringArg()),
  pagePage: nonNull(intArg()),
  pagePageSize: nonNull(intArg()),
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
      resolve: (parent, args, ctx) => {
        const { pageAccessToken, pageUserId, pagePage, pagePageSize } = args
        const skip = pagePageSize * (pagePage - 1)
        if (
          pageAccessToken &&
          pageUserId &&
          isSafe(pageAccessToken, pageUserId)
        ) {
          return prisma.page.findMany({
            skip,
            take: pagePageSize,
            orderBy: { created_at: "desc" },
            where: {
              chapter_id: `${parent.id}`,
            },
          })
        }
        return parent.publish
          ? prisma.page.findMany({
              skip,
              take: pagePageSize,
              orderBy: { created_at: "desc" },
              where: {
                chapter_id: `${parent.id}`,
              },
            })
          : []
      },
    })
    t.field("episode", {
      type: "Episode",
      resolve: (parent, args, ctx) => {
        return parent.episode_id
          ? prisma.episode.findUnique({
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
