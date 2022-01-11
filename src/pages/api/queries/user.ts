import { nonNull, nullable, ObjectDefinitionBlock } from "nexus/dist/core"
import { stringArg } from "nexus"
import prisma from "src/lib/prisma"
import { defaultArgs, decodeUserId } from "../index.page"

const QueryUsers = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryUsers", {
    type: "User",
    args: {
      searchUserName: nullable(stringArg()),
      ...defaultArgs,
    },
    resolve: (_, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      return prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchUserName && {
            user_name: { contains: args.searchUserName },
          }),
        },
      })
    },
  })
}

const QueryUserById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryUserById", {
    type: "User",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_, args) => {
      return prisma.user.findUnique({
        where: { id: args.id },
      })
    },
  })
}

const QueryMe = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryMe", {
    type: "User",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: (_, args) => {
      return prisma.user.findUnique({
        where: { id: `${decodeUserId(args.accessToken)}` },
      })
    },
  })
}

export { QueryMe, QueryUserById, QueryUsers }