import { nonNull, nullable, stringArg, list } from "nexus"
import { booleanArg, ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { decodeUserId } from "src/pages/api/index.page"

// model Story {
//   id                  String            @id @unique @default(uuid())
//   user_id             String
//   story_title         String
//   story_synopsis      String?
//   story_image         String?
//   story_categories    String[]
//   viewing_restriction String?
//   publish             Boolean           @default(false) @db.Boolean
//   created_at          DateTime          @default(now())
//   updated_at          DateTime?
// }

const createStory = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("createStory", {
    type: "Story",
    args: {
      storyTitle: nonNull(stringArg()),
      storySynopsis: nullable(stringArg()),
      storyCategories: nonNull(list(stringArg())),
      storyImage: nullable(stringArg()),
      viewingRestriction: nullable(stringArg()),
      publish: nonNull(booleanArg()),
      acessToken: nonNull(stringArg()),
    },
    resolve: (_, args, ctx) => {
      return prisma.story.create({
        data: {
          story_title: `${args.storyTitle}`,
          story_synopsis: `${args.storySynopsis}`,
          story_categories: `${args.storyCategories}`,
          story_image: `${args.storyImage}`,
          viewing_restriction: `${args.viewingRestriction}`,
          publish: args.publish,
          user_id: `${decodeUserId(args.acessToken)}`,
        },
      })
    },
  })
}

const updateStory = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateStory", {
    type: "Story",
    args: {
      storyId: nonNull(stringArg()),
      storyTitle: nullable(stringArg()),
      storySynopsis: nullable(stringArg()),
      storyCategories: nullable(list(stringArg())),
      storyImage: nullable(stringArg()),
      viewingRestriction: nullable(stringArg()),
      publish: nonNull(booleanArg()),
    },
    resolve: (_, args, ctx) => {
      return prisma.story.update({
        where: {
          id: `${args.storyId}`,
        },
        data: {
          story_title: `${args.storyTitle}`,
          story_synopsis: `${args.storySynopsis}`,
          story_categories: `${args.storyCategories}`,
          story_image: `${args.storyImage}`,
          viewing_restriction: `${args.viewingRestriction}`,
          publish: args.publish,
        },
      })
    },
  })
}

const deleteStory = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteStory", {
    type: "Story",
    args: {
      storyId: nonNull(stringArg()),
    },
    resolve: (_, args, ctx) => {
      return prisma.story.delete({
        where: {
          id: `${args.storyId}`,
        },
      })
    },
  })
}

export { createStory, updateStory, deleteStory }
