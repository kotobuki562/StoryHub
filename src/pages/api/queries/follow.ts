import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import {
  authArgs,
  defaultArgs,
  isSafe,
  decodeUserId,
} from "src/pages/api/index.page"

const QueryFollowers = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryFollowers", {
    type: "Follow",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      const followers = prisma.follow.findMany({
        orderBy: { created_at: "asc" },
        where: {
          follow_id: `${decodeUserId(args.accessToken)}`,
        },
      })
      return followers
    },
  })
}

const QueryFollowing = (t: ObjectDefinitionBlock<"Query">) => {
  return t.list.field("QueryFollowing", {
    type: "Follow",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      const following = prisma.follow.findMany({
        orderBy: { created_at: "asc" },
        where: {
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      })
      return following
    },
  })
}

export { QueryFollowers, QueryFollowing }
