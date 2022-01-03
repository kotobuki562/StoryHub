import { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, stringArg } from "nexus"
import prisma from "src/lib/prisma"

const QueryMe = (t: ObjectDefinitionBlock<"Query">) => {
  return t.field("QueryMe", {
    type: "User",
    args: {
      userId: nonNull(stringArg()),
    },
    resolve: (_, args) => {
      return prisma.user.findUnique({
        where: { id: args.userId },
      })
    },
  })
}

export { QueryMe }
