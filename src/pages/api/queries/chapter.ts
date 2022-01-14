import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus"
import prisma from "src/lib/prisma"
import { authArgs, defaultArgs, isSafe } from "src/pages/api/index.page"

const chapterArgs = {
  searchTitle: nullable(stringArg()),
  serchSeasonId: nullable(stringArg()),
}

const QueryChapters = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryChapters", {
    type: "Chapter",
    args: {
      ...chapterArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const seasons = await prisma.chapter.findMany({
        skip,
        take: pageSize,
        // 古い順
        orderBy: { created_at: "asc" },
        where: {
          ...(args.searchTitle && {
            chapter_title: { contains: args.searchTitle },
          }),
          ...(args.serchSeasonId && {
            episode_id: args.serchSeasonId,
          }),
          publish: true,
        },
      })
      return seasons
    },
  })
}

const QueryMyChapters = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryMyChapters", {
    type: "Chapter",
    args: {
      ...chapterArgs,
      ...authArgs,
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      return isSafe(args.accessToken, args.userId)
        ? prisma.chapter.findMany({
            skip,
            take: pageSize,
            orderBy: { created_at: "asc" },
            where: {
              ...(args.searchTitle && {
                chapter_title: { contains: args.searchTitle },
                ...(args.serchSeasonId && {
                  episode_id: args.serchSeasonId,
                }),
              }),
            },
          })
        : null
    },
  })
}

const QueryChapterById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryChapterById", {
    type: "Chapter",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.character.findUnique({
        where: {
          id: args.id,
        },
        select: {
          publish: true,
        },
      })
    },
  })
}

const QueryMyChapterById = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryMyChapterById", {
    type: "Chapter",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? prisma.chapter.findUnique({
            where: {
              id: args.id,
            },
          })
        : null
    },
  })
}

const QueryChaptersCountByPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryChaptersCountByPublish", {
    type: "Int",
    resolve: (_parent, args) => {
      return prisma.chapter.count({
        where: {
          publish: true,
        },
      })
    },
  })
}

const QueryChaptersCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryChaptersCountByUnPublish", {
    type: "Int",
    resolve: (_parent, args) => {
      return prisma.chapter.count({
        where: {
          publish: false,
        },
      })
    },
  })
}

export {
  QueryChapters,
  QueryMyChapters,
  QueryChapterById,
  QueryMyChapterById,
  QueryChaptersCountByPublish,
  QueryChaptersCountByUnPublish,
}
