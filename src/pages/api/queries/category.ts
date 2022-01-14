import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus"
import prisma from "src/lib/prisma"
import { defaultArgs } from "src/pages/api/index.page"

const QueryCategories = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryCategories", {
    type: "Category",
    args: {
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      return prisma.category.findMany({
        orderBy: { created_at: "desc" },
      })
    },
  })
}

const QueryCategory = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryCategory", {
    type: "Category",
    args: {
      id: nonNull(stringArg()),
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      return prisma.category.findUnique({
        where: {
          id: Number(args.id),
        },
      })
    },
  })
}

const QueryCategoryCount = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryCategoryCount", {
    type: "Int",
    args: {
      ...defaultArgs,
    },
    resolve: (_parent, args) => {
      return prisma.category.count()
    },
  })
}

export { QueryCategories, QueryCategory, QueryCategoryCount }
