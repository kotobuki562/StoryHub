import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"

const QueryCategories = (t: ObjectDefinitionBlock<"Query">) =>
  t.list.field("QueryCategories", {
    type: "Category",
    resolve: _parent =>
      prisma.category.findMany({
        orderBy: { created_at: "desc" },
      }),
  })

export { QueryCategories }
