import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, isSafe } from "src/pages/api/index.page"

const chapterArgs = {
  searchTitle: nullable(stringArg()),
  serchSeasonId: nullable(stringArg()),
}

const QueryChapters = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryChapters", {
    type: "Chapter",
    args: {
      ...chapterArgs,
    },
    resolve: async (_parent, args) => {
      const seasons = await prisma.chapter.findMany({
        orderBy: { created_at: "asc" },
        where: {
          ...(args.searchTitle && {
            chapter_title: { search: args.searchTitle },
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
    },
    resolve: async (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? await prisma.chapter.findMany({
            orderBy: { created_at: "asc" },
            where: {
              ...(args.searchTitle && {
                chapter_title: { search: args.searchTitle },
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
    resolve: async (_parent, args) => {
      return await prisma.character.findUnique({
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
    },
    resolve: async (_parent, args) => {
      return isSafe(args.accessToken, args.userId)
        ? await prisma.chapter.findUnique({
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
    resolve: async (_parent, _args) => {
      return await prisma.chapter.count({
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
    resolve: async (_parent, _args) => {
      return await prisma.chapter.count({
        where: {
          publish: false,
        },
      })
    },
  })
}

export {
  QueryChapterById,
  QueryChapters,
  QueryChaptersCountByPublish,
  QueryChaptersCountByUnPublish,
  QueryMyChapterById,
  QueryMyChapters,
}
