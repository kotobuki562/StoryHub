import { ApolloServer } from "apollo-server-micro"
import { DateTimeResolver } from "graphql-scalars"
import jwt from "jsonwebtoken"
import cors from "micro-cors"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import {
  asNexusMethod,
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
} from "nexus"
import path from "path"
import { Chapter } from "src/pages/api/models/chapter"
import { Character } from "src/pages/api/models/character"
import { Episode } from "src/pages/api/models/episode"
import { Favorite } from "src/pages/api/models/favorite"
import { Follow } from "src/pages/api/models/follow"
import { Notification } from "src/pages/api/models/notification"
import { Object } from "src/pages/api/models/object"
import { Page } from "src/pages/api/models/page"
import { Review } from "src/pages/api/models/review"
import { Season } from "src/pages/api/models/season"
import { SettingMaterial } from "src/pages/api/models/settingMaterial"
import { Story } from "src/pages/api/models/story"
import { Terminology } from "src/pages/api/models/terminology"
import { User } from "src/pages/api/models/user"
import {
  createEpisode,
  deleteEpisode,
  updateEpisode,
} from "src/pages/api/mutations/episode"
import {
  createNotification,
  deleteAllNotifications,
  deleteNotification,
} from "src/pages/api/mutations/notification"
import {
  createReview,
  deleteReview,
  updateReview,
} from "src/pages/api/mutations/review"
import {
  createSeason,
  deleteSeason,
  updateSeason,
} from "src/pages/api/mutations/season"
import {
  createStory,
  deleteStory,
  updateStory,
} from "src/pages/api/mutations/story"
import {
  createUser,
  deleteUser,
  signupUser,
  updateUser,
} from "src/pages/api/mutations/user"
import {
  QueryChapterById,
  QueryChapters,
  QueryChaptersCountByPublish,
  QueryChaptersCountByUnPublish,
  QueryMyChapterById,
  QueryMyChapters,
} from "src/pages/api/queries/chapter"
import {
  QueryCharacterById,
  QueryCharacters,
  QueryCharactersCountByPublish,
  QueryCharactersCountByUnPublish,
  QueryMyCharacterById,
  QueryMyCharacters,
} from "src/pages/api/queries/character"
import {
  QueryEpisodeById,
  QueryEpisodes,
  QueryEpisodesCountByPublish,
  QueryEpisodesCountByUnPublish,
  QueryMyEpisodeById,
  QueryMyEpisodes,
} from "src/pages/api/queries/episode"
import {
  QueryFavoritesByStory,
  QueryFavoritesByUser,
  QueryMyFavoritesByStory,
  QueryMyFavoritesByUser,
} from "src/pages/api/queries/favorite"
import { QueryFollowers, QueryFollowing } from "src/pages/api/queries/follow"
import { QueryNotificationsForUser } from "src/pages/api/queries/notification"
import {
  QueryMyObjectById,
  QueryMyObjects,
  QueryObjectById,
  QueryObjects,
  QueryObjectsCountByPublish,
  QueryObjectsCountByUnPublish,
} from "src/pages/api/queries/object"
import {
  QueryPage,
  QueryPageCountByChapterId,
  QueryPages,
} from "src/pages/api/queries/page"
import {
  QueryMyReviewById,
  QueryMyReviews,
  QueryReviewById,
  QueryReviews,
  QueryReviewsByStoryId,
  QueryReviewsCount,
  QueryReviewsCountByStoryId,
} from "src/pages/api/queries/review"
import {
  QueryMySeasonById,
  QueryMySeasons,
  QuerySeasonById,
  QuerySeasons,
  QuerySeasonsCountByPublish,
  QuerySeasonsCountByUnPublish,
} from "src/pages/api/queries/season"
import {
  QueryMySettingMaterialById,
  QueryMySettingMaterials,
  QuerySettingMaterialById,
  QuerySettingMaterials,
  QuerySettingMaterialsCountByPublish,
  QuerySettingMaterialsCountByUnPublish,
} from "src/pages/api/queries/settingMaterial"
import {
  QueryMyStories,
  QueryMyStoryById,
  QueryStories,
  QueryStoriesCountByPublish,
  QueryStoriesCountByUnPublish,
  QueryStoryById,
} from "src/pages/api/queries/story"
import {
  QueryMyTerminologies,
  QueryMyTerminologyById,
  QueryTerminologies,
  QueryTerminologiesCountByPublish,
  QueryTerminologiesCountByUnPublish,
  QueryTerminologyById,
} from "src/pages/api/queries/terminology"
import { QueryMe, QueryUserById, QueryUsers } from "src/pages/api/queries/user"

import { context } from "./context"

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

    // チャプターのクエリ
    QueryChapters(t)
    QueryChapterById(t)
    QueryMyChapters(t)
    QueryMyChapterById(t)
    QueryChaptersCountByPublish(t)
    QueryChaptersCountByUnPublish(t)

    // ページのクエリ
    QueryPages(t)
    QueryPage(t)
    QueryPageCountByChapterId(t)

    // レビューのクエリ
    QueryReviews(t)
    QueryMyReviews(t)
    QueryReviewById(t)
    QueryMyReviewById(t)
    QueryReviewsCount(t)
    QueryReviewsByStoryId(t)
    QueryReviewsCountByStoryId(t)

    // フォローのクエリ
    QueryFollowers(t)
    QueryFollowing(t)

    // 設定のクエリ
    QuerySettingMaterials(t)
    QuerySettingMaterialById(t)
    QueryMySettingMaterials(t)
    QueryMySettingMaterialById(t)
    QuerySettingMaterialsCountByPublish(t)
    QuerySettingMaterialsCountByUnPublish(t)

    // キャラクターのクエリ
    QueryCharacters(t)
    QueryCharacterById(t)
    QueryMyCharacters(t)
    QueryMyCharacterById(t)
    QueryCharactersCountByPublish(t)
    QueryCharactersCountByUnPublish(t)

    // オブジェクトのクエリ
    QueryObjects(t)
    QueryObjectById(t)
    QueryMyObjects(t)
    QueryMyObjectById(t)
    QueryObjectsCountByPublish(t)
    QueryObjectsCountByUnPublish(t)

    // 専門用語のクエリ
    QueryTerminologies(t)
    QueryTerminologyById(t)
    QueryMyTerminologies(t)
    QueryMyTerminologyById(t)
    QueryTerminologiesCountByPublish(t)
    QueryTerminologiesCountByUnPublish(t)

    // ファボのクエリ
    QueryFavoritesByUser(t)
    QueryFavoritesByStory(t)
    QueryMyFavoritesByUser(t)
    QueryMyFavoritesByStory(t)

    // 通知のクエリ
    QueryNotificationsForUser(t)
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

    // シーズンのミューテーション
    createSeason(t)
    updateSeason(t)
    deleteSeason(t)

    // レビューのミューテーション
    createReview(t)
    updateReview(t)
    deleteReview(t)

    // 通知のミューテーション
    createNotification(t)
    deleteAllNotifications(t)
    deleteNotification(t)

    // エピソードのミューテーション
    createEpisode(t)
    updateEpisode(t)
    deleteEpisode(t)
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
    Character,
    Terminology,
    Object,
    SettingMaterial,
    User,
    Notification,
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

const getApolloServerHandler = async () => {
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-default-export
export default cors()(handler)
