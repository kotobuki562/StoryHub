import { ApolloServer } from "apollo-server-micro"
import { DateTimeResolver } from "graphql-scalars"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import {
  asNexusMethod,
  intArg,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { makeExecutableSchema } from "@graphql-tools/schema"
import path from "path"
import cors from "micro-cors"
import prisma from "src/lib/prisma"
import supabase from "src/lib/supabase"
import jwt from "jsonwebtoken"
import { Category } from "src/pages/api/models/category"
import { User } from "src/pages/api/models/user"
import { Review } from "src/pages/api/models/review"
import { Story } from "src/pages/api/models/story"
import { SettingMaterial } from "src/pages/api/models/settingMaterial"
import { Character } from "src/pages/api/models/character"
import { QueryMe, QueryUserById, QueryUsers } from "src/pages/api/queries/user"
import {
  QueryStories,
  QueryMyStories,
  QueryStoryById,
  QueryMyStoryById,
  QueryStoriesCountByUnPublish,
  QueryStoriesCountByPublish,
} from "src/pages/api/queries/story"
import {
  QuerySeasons,
  QuerySeasonById,
  QueryMySeasons,
  QueryMySeasonById,
  QuerySeasonsCountByPublish,
  QuerySeasonsCountByUnPublish,
} from "src/pages/api/queries/season"
import {
  QueryEpisodes,
  QueryEpisodeById,
  QueryMyEpisodes,
  QueryMyEpisodeById,
  QueryEpisodesCountByPublish,
  QueryEpisodesCountByUnPublish,
} from "src/pages/api/queries/episode"
import { Favorite } from "src/pages/api/models/favorite"
import { Follow } from "src/pages/api/models/follow"
import { Episode } from "src/pages/api/models/episode"
import { Chapter } from "src/pages/api/models/chapter"
import { Page } from "src/pages/api/models/page"
import { Season } from "src/pages/api/models/season"
import { context } from "./context"
import { Terminology } from "src/pages/api/models/terminology"
import { Object } from "src/pages/api/models/object"
import {
  signupUser,
  createUser,
  updateUser,
  deleteUser,
} from "src/pages/api/mutations/user"
import {
  createStory,
  updateStory,
  deleteStory,
} from "src/pages/api/mutations/story"

export const GQLDate = asNexusMethod(DateTimeResolver, "date")

export const isSafe = (acess_token: string, userId: string) => {
  try {
    const decodeData = jwt.decode(acess_token)
    const user_id = decodeData?.sub
    return userId === user_id ? true : false
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export const decodeUserId = (acess_token: string) => {
  try {
    const decodeData = jwt.decode(acess_token)
    const user_id = decodeData?.sub
    return user_id
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export const defaultArgs = {
  page: nonNull(intArg()),
  pageSize: nonNull(intArg()),
}

export const authArgs = {
  userId: nonNull(stringArg()),
  accessToken: nonNull(stringArg()),
}

const Query = objectType({
  name: "Query",
  definition(t) {
    // ユーザーのクエリ
    QueryMe(t)
    QueryUserById(t)
    QueryUsers(t)

    // ストーリーのクエリ
    QueryStories(t)
    QueryMyStories(t)
    QueryStoryById(t)
    QueryMyStoryById(t)
    QueryStoriesCountByUnPublish(t)
    QueryStoriesCountByPublish(t)

    // シーズンのクエリ
    QuerySeasons(t)
    QuerySeasonById(t)
    QueryMySeasons(t)
    QueryMySeasonById(t)
    QuerySeasonsCountByPublish(t)
    QuerySeasonsCountByUnPublish(t)

    // エピソードのクエリ
    QueryEpisodes(t)
    QueryEpisodeById(t)
    QueryMyEpisodes(t)
    QueryMyEpisodeById(t)
    QueryEpisodesCountByPublish(t)
    QueryEpisodesCountByUnPublish(t)

    // 全て取得する
    t.list.field("categories", {
      type: "Category",
      resolve: (_parent, _args) => {
        return prisma.category.findMany()
      },
    })

    t.list.field("reviews", {
      type: "Review",
      resolve: (_parent, _args) => {
        return prisma.review.findMany({
          where: { publish: true },
        })
      },
    })

    t.list.field("QueryPageReviews", {
      type: "Review",
      args: {
        page: stringArg({ default: "1" }),
      },
      resolve: async (_parent, args) => {
        const { page } = args
        const pageSize = 10
        const skip = pageSize * (Number(page) - 1)
        const reviews = await prisma.review.findMany({
          skip,
          take: pageSize,
          orderBy: { created_at: "desc" },
        })
        return reviews
      },
    })

    t.list.field("filterReviewsByUserId", {
      type: "Review",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: async (_parent, args) => {
        return await prisma.review.findMany({
          where: {
            user_id: args.userId,
          },
        })
      },
    })

    t.list.field("filterReviewsByStoryId", {
      type: "Review",
      args: {
        storyId: nonNull(stringArg()),
      },
      resolve: async (_parent, args) => {
        return await prisma.review.findMany({
          where: {
            story_id: args.storyId,
          },
        })
      },
    })

    t.list.field("filterFollowsByUserId", {
      type: "Follow",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: (_parent, args) => {
        return prisma.follow.findMany({
          where: { user_id: args.userId },
        })
      },
    })

    t.list.field("filterFollowsByFollowId", {
      type: "Follow",
      args: {
        followId: nonNull(stringArg()),
      },
      resolve: (_parent, args) => {
        return prisma.follow.findMany({
          where: { follow_id: args.followId },
        })
      },
    })

    t.list.field("filterFavoritesByUserId", {
      type: "Favorite",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: (_parent, args) => {
        return prisma.favorite.findMany({
          where: { user_id: args.userId },
        })
      },
    })

    t.list.field("filterFavoritesByStoryId", {
      type: "Favorite",
      args: {
        storyId: nonNull(stringArg()),
      },
      resolve: (_parent, args) => {
        return prisma.favorite.findMany({
          where: { story_id: args.storyId },
        })
      },
    })
    // UserIdに紐づくStoryを取得
    t.list.field("filterStoriesByUserId", {
      type: "Story",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: (_parent, args) => {
        return prisma.story.findMany({
          where: { user_id: args.userId },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    // ユーザーのミューテーション
    signupUser(t)
    createUser(t)
    updateUser(t)
    deleteUser(t)

    // ストーリーのミューテーション
    createStory(t)
    updateStory(t)
    deleteStory(t)
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Episode,
    Chapter,
    Page,
    Season,
    Favorite,
    Follow,
    Story,
    Review,
    Category,
    Character,
    Terminology,
    Object,
    SettingMaterial,
    User,
    GQLDate,
  ],
  outputs: {
    typegen: path.join(process.cwd(), "src/generated/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "src/generated/schema.graphql"),
  },
  // contextType: {
  //   module: require.resolve("./context"),
  //   export: "Context",
  // },
  // sourceTypes: {
  //   modules: [
  //     {
  //       module: "@prisma/client",
  //       alias: "prisma",
  //     },
  //   ],
  // },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({ schema, context: context })

let apolloServerHandler: NextApiHandler

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    await apolloServer.start()

    apolloServerHandler = apolloServer.createHandler({
      path: "/api",
    })
  }

  return apolloServerHandler
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === "OPTIONS") {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}

// @ts-ignore
export default cors()(handler)
