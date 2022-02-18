import { nullable, objectType, stringArg } from "nexus"
import prisma from "src/lib/prisma"

import { isSafe } from "../index.page"

const episodeArgs = {
  episodeAccessToken: nullable(stringArg()),
  episodeUserId: nullable(stringArg()),
}

const characterArgs = {
  characterAccessToken: nullable(stringArg()),
  characterUserId: nullable(stringArg()),
}

const objectArgs = {
  objectAccessToken: nullable(stringArg()),
  objectUserId: nullable(stringArg()),
}

const terminologyArgs = {
  terminologyAccessToken: nullable(stringArg()),
  terminologyUserId: nullable(stringArg()),
}

const Season = objectType({
  name: "Season",
  definition(t) {
    t.id("id")
    t.string("story_id")
    t.string("season_title")
    t.string("season_image")
    t.string("season_synopsis")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("episodes", {
      type: "Episode",
      args: episodeArgs,
      resolve: async (parent, args) => {
        const { episodeAccessToken, episodeUserId } = args
        return episodeAccessToken &&
          episodeUserId &&
          isSafe(episodeAccessToken, episodeUserId)
          ? await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .episodes({
                orderBy: { created_at: "asc" },
              })
          : await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .episodes({
                orderBy: { created_at: "asc" },
                where: { publish: true },
              })
      },
    })
    t.list.field("characters", {
      type: "Character",
      args: characterArgs,
      resolve: async (parent, args) => {
        const { characterAccessToken, characterUserId } = args
        return characterAccessToken &&
          characterUserId &&
          isSafe(characterAccessToken, characterUserId)
          ? await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .characters({
                orderBy: { created_at: "desc" },
              })
          : await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .characters({
                orderBy: { created_at: "desc" },
                where: {
                  publish: true,
                },
              })
      },
    })
    t.list.field("objects", {
      type: "Object",
      args: objectArgs,
      resolve: async (parent, args) => {
        const { objectAccessToken, objectUserId } = args
        return objectAccessToken &&
          objectUserId &&
          isSafe(objectAccessToken, objectUserId)
          ? await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .objects({
                orderBy: { created_at: "desc" },
              })
          : await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .objects({
                orderBy: { created_at: "desc" },
                where: {
                  publish: true,
                },
              })
      },
    })
    t.list.field("terminologies", {
      type: "Terminology",
      args: terminologyArgs,
      resolve: async (parent, args) => {
        const { terminologyAccessToken, terminologyUserId } = args
        return terminologyAccessToken &&
          terminologyUserId &&
          isSafe(terminologyAccessToken, terminologyUserId)
          ? await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .terminologies({
                orderBy: { created_at: "desc" },
              })
          : await prisma.season
              .findUnique({
                where: {
                  id: parent.id || undefined,
                },
              })
              .terminologies({
                orderBy: { created_at: "desc" },
                where: {
                  publish: true,
                },
              })
      },
    })
    t.field("story", {
      type: "Story",
      resolve: async parent => {
        return await prisma.season
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .story()
      },
    })
  },
})

export { Season }
