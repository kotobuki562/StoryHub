import { objectType } from "nexus"
import prisma from "src/lib/prisma"

const Story = objectType({
  name: "Story",
  definition(t) {
    t.id("id")
    t.nullable.string("user_id")
    t.nullable.string("story_title")
    t.nullable.string("story_synopsis")
    t.nullable.string("story_image")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.nullable.field("user", {
      type: "User",
      resolve: async (parent, _args, _ctx) => {
        return await prisma.user.findUnique({
          where: {
            id: `${parent.user_id}`,
          },
        })
      },
    })
  },
})

export { Story }
