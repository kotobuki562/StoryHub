import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, isSafe } from "src/pages/api/index.page"

const chapterArgs = {
  searchTitle: nullable(stringArg()),
  serchSeasonId: nullable(stringArg()),
}

const QueryChapters = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryChapters", {
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

const QueryMyChapters = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryMyChapters", {
    type: "Chapter",
    args: {
      ...chapterArgs,
      ...authArgs,
    },
    resolve: (_parent, args) =>
      isSafe(args.accessToken, args.userId)
        ? prisma.chapter.findMany({
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
        : null,
  })

const QueryChapterById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryChapterById", {
    type: "Chapter",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) =>
      prisma.character.findUnique({
        where: {
          id: args.id,
        },
        select: {
          publish: true,
        },
      }),
  })

const QueryMyChapterById = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryMyChapterById", {
    type: "Chapter",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: (_parent, args) =>
      isSafe(args.accessToken, args.userId)
        ? prisma.chapter.findUnique({
            where: {
              id: args.id,
            },
          })
        : null,
  })

const QueryChaptersCountByPublish = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryChaptersCountByPublish", {
    type: "Int",
    resolve: (_parent, _args) =>
      prisma.chapter.count({
        where: {
          publish: true,
        },
      }),
  })

const QueryChaptersCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) =>
  t.field("QueryChaptersCountByUnPublish", {
    type: "Int",
    resolve: (_parent, _args) =>
      prisma.chapter.count({
        where: {
          publish: false,
        },
      }),
  })

export {
  QueryChapterById,
  QueryChapters,
  QueryChaptersCountByPublish,
  QueryChaptersCountByUnPublish,
  QueryMyChapterById,
  QueryMyChapters,
}
