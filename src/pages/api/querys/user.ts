import { nullable, ObjectDefinitionBlock } from "nexus/dist/core"
import { stringArg } from "nexus"
import prisma from "src/lib/prisma"
import { defaultArgs, isSafe, authArgs } from "../index.page"

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

const QueryMe = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryMe", {
    type: "User",
    args: {
      ...authArgs,
    },
    resolve: (_, args) => {
      return isSafe(args.accessToken, args.userId)
        ? prisma.user.findUnique({
            where: { id: args.userId },
          })
        : null
    },
  })
}

export { QueryMe, QueryUsers }
