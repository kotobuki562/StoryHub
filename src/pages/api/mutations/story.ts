import { list, nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { booleanArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { decodeUserId, isSafe } from "src/pages/api/index.page"

const createStory = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("createStory", {
    type: "Story",
    args: {
      storyTitle: nonNull(stringArg()),
      storySynopsis: nonNull(stringArg()),
      storyCategories: nonNull(list(nonNull(stringArg()))),
      storyImage: nullable(stringArg()),
      viewingRestriction: nullable(stringArg()),
      publish: nonNull(booleanArg()),
      acessToken: nonNull(stringArg()),
    },
    resolve: (_, args, _ctx) => {
      return prisma.story.create({
        data: {
          story_title: args.storyTitle,
          story_synopsis: args.storySynopsis,
          story_categories: args.storyCategories,
          story_image: args.storyImage,
          viewing_restriction: args.viewingRestriction,
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
      storyTitle: nonNull(stringArg()),
      storySynopsis: nonNull(stringArg()),
      storyCategories: nonNull(list(nonNull(stringArg()))),
      storyImage: nullable(stringArg()),
      viewingRestriction: nullable(stringArg()),
      publish: nonNull(booleanArg()),
      acessToken: nonNull(stringArg()),
      userId: nonNull(stringArg()),
    },
    resolve: (_, args) => {
      return isSafe(args.acessToken, args.userId)
        ? prisma.story.update({
            where: {
              id: `${args.storyId}`,
            },
            data: {
              story_title: args.storyTitle,
              story_synopsis: args.storySynopsis,
              story_categories: args.storyCategories,
              story_image: args.storyImage,
              viewing_restriction: args.viewingRestriction,
              publish: args.publish,
              updated_at: new Date(),
            },
          })
        : null
    },
  })
}

const deleteStory = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteStory", {
    type: "Story",
    args: {
      storyId: nonNull(stringArg()),
    },
    resolve: (_, args) => {
      return prisma.story.delete({
        where: {
          id: `${args.storyId}`,
        },
      })
    },
  })
}

export { createStory, deleteStory, updateStory }
