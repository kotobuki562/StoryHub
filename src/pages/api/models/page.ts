import { objectType } from "nexus"
import prisma from "src/lib/prisma"

// model Page {
//   id         String    @id @unique @default(uuid())
//   chapter_id String?
//   page_body  String?
//   created_at DateTime  @default(now())
//   updated_at DateTime?
//   chapter    Chapter?  @relation(fields: [chapter_id], references: [id])
// }

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
      resolve: (parent, args, ctx) => {
        return parent.chapter_id
          ? prisma.chapter.findUnique({
              where: {
                id: parent.chapter_id,
              },
            })
          : null
      },
    })
  },
})

export { Page }
