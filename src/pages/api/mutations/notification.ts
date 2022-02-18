import { booleanArg, list, nonNull, nullable, stringArg } from "nexus"
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
      isRead: nonNull(booleanArg()),
      notificationTitle: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      return await prisma.notification.create({
        data: {
          user_id: decodeUserId(args.accessToken) as string,
          receiver_id: args.receiverId,
          review_id: args.reviewId,
          favorite_id: args.favoriteId,
          follow_id: args.followId,
          is_read: args.isRead,
          notification_title: args.notificationTitle,
        },
      })
    },
  })
}

const updateNotification = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateNotification", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
      notificationId: nonNull(stringArg()),
      isRead: nonNull(booleanArg()),
      receiverId: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      return isSafe(args.accessToken, args.receiverId)
        ? await prisma.notification.update({
            where: {
              id: args.notificationId,
            },
            data: {
              is_read: args.isRead,
              updated_at: new Date(),
            },
          })
        : null
    },
  })
}

const updateManyNotifications = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateManyNotifications", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
      notificationIds: nonNull(list(nonNull(stringArg()))),
      isRead: nonNull(booleanArg()),
      receiverId: nonNull(stringArg()),
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolve: async (_parent, args) => {
      return isSafe(args.accessToken, args.receiverId)
        ? await prisma.notification.updateMany({
            where: {
              id: {
                in: args.notificationIds,
              },
            },
            data: {
              is_read: args.isRead,
              updated_at: new Date(),
            },
          })
        : null
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
    resolve: async (_parent, args) => {
      return isSafe(args.accessToken, args.receiverId)
        ? await prisma.notification.delete({
            where: {
              id: args.notificationId,
            },
          })
        : null
    },
  })
}

const deleteManyNotifications = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteManyNotifications", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
      notificationIds: nonNull(list(nonNull(stringArg()))),
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolve: async (_parent, args) => {
      const myNotificationIds = await prisma.user
        .findUnique({
          where: {
            id: decodeUserId(args.accessToken)?.toString() || undefined,
          },
        })
        .notifications({
          select: {
            id: true,
          },
        })

      if (myNotificationIds) {
        const sameSelectIds = myNotificationIds.filter(notification => {
          return args.notificationIds.includes(notification.id)
        })
        return await prisma.notification.deleteMany({
          where: {
            id: {
              in: sameSelectIds.map(notification => {
                return notification.id
              }),
            },
          },
        })
      }
      return null
    },
  })
}

export {
  createNotification,
  deleteManyNotifications,
  deleteNotification,
  updateManyNotifications,
  updateNotification,
}
