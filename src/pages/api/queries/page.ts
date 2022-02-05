import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"

const pageArgs = {
  serchSeasonId: nullable(stringArg()),
}

const QueryPages = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryPages", {
    type: "Page",
    args: {
      ...pageArgs,
    },
    resolve: async (_parent, args) => {
      const pages = await prisma.page.findMany({
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
}

const QueryPage = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryPage", {
    type: "Page",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.page.findUnique({
        where: {
          id: args.id,
        },
      })
    },
  })
}

const QueryPageCountByChapterId = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryPageCountByChapterId", {
    type: "Int",
    args: {
      chapterId: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.page.count({
        where: {
          chapter_id: args.chapterId,
        },
      })
    },
  })
}

export { QueryPage, QueryPageCountByChapterId, QueryPages }
