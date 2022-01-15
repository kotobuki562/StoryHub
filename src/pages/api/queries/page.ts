import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { defaultArgs } from "src/pages/api/index.page"

const pageArgs = {
  serchSeasonId: nullable(stringArg()),
}

const QueryPages = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryPages", {
    type: "Page",
    args: {
      ...pageArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const pages = await prisma.page.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "asc" },
        where: {
          ...(args.serchSeasonId && {
            chapter_id: args.serchSeasonId,
          }),
        },
      })
      return pages
    },
  })

const QueryPage = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryPage", {
    type: "Page",
    args: {
      id: nonNull(stringArg()),
      ...defaultArgs,
    },
    resolve: (_parent, args) =>
      prisma.page.findUnique({
        where: {
          id: args.id,
        },
      }),
  })

const QueryPageCountByChapterId = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryPageCountByChapterId", {
    type: "Int",
    args: {
      chapterId: nonNull(stringArg()),
    },
    resolve: (_parent, args) =>
      prisma.page.count({
        where: {
          chapter_id: args.chapterId,
        },
      }),
  })

export { QueryPage, QueryPageCountByChapterId, QueryPages }
