import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Page = objectType({
  name: "Page",
  definition(t) {
    t.id("id")
    t.string("chapter_id")
    t.string("page_body")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.field("chapter", {
      type: "Chapter",
      resolve: async parent => {
        return await prisma.page
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .chapter()
      },
    })
  },
})

export { Page }
