import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { decodeUserId } from "src/pages/api/index.page"

const QueryNotificationsForUser = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryNotificationsForUser", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const notifications = await prisma.user
        .findUnique({
          where: {
            id: decodeUserId(args.accessToken)?.toString() || undefined,
          },
        })
        .notifications({
          orderBy: { created_at: "asc" },
        })
      return notifications
    },
  })
}

const QueryNotificationsForUserByIsRead = (
  t: ObjectDefinitionBlock<"Query">
) => {
  return t.list.field("QueryNotificationsForUserByIsRead", {
    type: "Notification",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const notifications = await prisma.user
        .findUnique({
          where: {
            id: decodeUserId(args.accessToken)?.toString() || undefined,
          },
        })
        .notifications({
          where: { is_read: false },
          orderBy: { created_at: "asc" },
        })
      return notifications
    },
  })
}

export { QueryNotificationsForUser, QueryNotificationsForUserByIsRead }
