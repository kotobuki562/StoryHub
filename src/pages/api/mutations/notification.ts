import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { decodeUserId, isSafe } from "src/pages/api/index.page"

const createNotification = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("createNotification", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
      receiverId: nonNull(stringArg()),
      reviewId: nullable(stringArg()),
      favoriteId: nullable(stringArg()),
      followId: nullable(stringArg()),
    },
    resolve: (_parent, args) => {
      return prisma.notification.create({
        data: {
          user_id: decodeUserId(args.accessToken) as string,
          receiver_id: args.receiverId,
          review_id: args.reviewId,
          favorite_id: args.favoriteId,
          follow_id: args.followId,
        },
      })
    },
  })
}

const deleteNotification = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteNotification", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
      notificationId: nonNull(stringArg()),
      receiverId: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      return isSafe(args.accessToken, args.receiverId)
        ? prisma.notification.delete({
            where: {
              id: args.notificationId,
            },
          })
        : null
    },
  })
}

const deleteAllNotifications = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteAllNotifications", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      return await prisma.notification.deleteMany({
        where: {
          receiver_id: decodeUserId(args.accessToken) as string,
        },
      })
    },
  })
}

export { createNotification, deleteAllNotifications, deleteNotification }
