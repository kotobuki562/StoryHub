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
    resolve: (_parent, args) => {
      return prisma.notification.findMany({
        orderBy: { created_at: "asc" },
        where: {
          review_id: `${decodeUserId(args.accessToken)}`,
        },
      })
    },
  })
}

export { QueryNotificationsForUser }
