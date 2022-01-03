import { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"

const QueryStories = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryStories", {
    type: "Story",
    resolve: (_parent, _args) => {
      return prisma.story.findMany({
        where: { publish: true },
      })
    },
  })
}

export { QueryStories }
