import { objectType } from "nexus"
import prisma from "src/lib/prisma"

// model Chapter {
//   id            String    @id @unique @default(uuid())
//   episode_id    String
//   chapter_title String
//   chapter_image String?
//   publish       Boolean   @default(false) @db.Boolean
//   created_at    DateTime  @default(now())
//   updated_at    DateTime?
//   pages         Page[]
//   episode       Episode?  @relation(fields: [episode_id], references: [id])
// }

const Chapter = objectType({
  name: "Chapter",
  definition(t) {
    t.id("id")
    t.string("episode_id")
    t.string("chapter_title")
    t.string("chapter_image")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("pages", {
      type: "Page",
      resolve: (parent, args, ctx) => {
        return parent.id
          ? prisma.page.findMany({
              where: {
                chapter_id: parent.id,
              },
            })
          : []
      },
    })
    t.field("episode", {
      type: "Episode",
      resolve: (parent, args, ctx) => {
        return parent.episode_id
          ? prisma.episode.findUnique({
              where: {
                id: parent.episode_id,
              },
            })
          : null
      },
    })
  },
})

export { Chapter }
