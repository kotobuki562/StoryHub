import { ApolloServer } from "apollo-server-micro"
import { DateTimeResolver } from "graphql-scalars"
import { NextApiHandler } from "next"
import {
  asNexusMethod,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"
import path from "path"
import cors from "micro-cors"
import prisma from "src/lib/prisma"

export const GQLDate = asNexusMethod(DateTimeResolver, "date")

const Category = objectType({
  name: "Category",
  definition(t) {
    // idは数値のid
    t.int("id")
    t.nullable.string("user_id")
    t.nullable.string("category_title")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        return prisma.user.findUnique({
          where: { id: parent.user_id },
        })
      },
    })
  },
})

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id")
    t.string("user_name")
    t.string("user_deal")
    t.string("image")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.list.field("stories", {
      type: "Story",
      resolve: (parent, args, ctx) => {
        return prisma.story.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
  },
})

const Follow = objectType({
  name: "Follow",
  definition(t) {
    t.int("id")
    t.string("user_id")
    t.string("follow_id")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        return prisma.user.findUnique({
          where: { id: parent.user_id },
        })
      },
    })
  },
})

const Favorite = objectType({
  name: "Favorite",
  definition(t) {
    t.int("id")
    t.string("user_id")
    t.string("story_id")
    t.date("created_at")
    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        return prisma.user.findUnique({
          where: { id: parent.user_id },
        })
      },
    })
    t.field("story", {
      type: "Story",
      resolve: (parent, args, ctx) => {
        return prisma.story.findUnique({
          where: { id: parent.story_id },
        })
      },
    })
  },
})

const Story = objectType({
  name: "Story",
  definition(t) {
    t.id("id")
    t.nullable.string("user_id")
    t.nullable.string("story_title")
    t.nullable.string("story_synopsis")
    t.nullable.string("story_image")
    t.boolean("publish")
    t.date("created_at")
    t.nullable.date("updated_at")
    t.nullable.field("user", {
      type: "User",
      resolve: async (parent, _args, _ctx) => {
        return await prisma.user.findUnique({
          where: {
            id: parent.user_id,
          },
        })
      },
    })
  },
})

const Post = objectType({
  name: "Post",
  definition(t) {
    t.int("id")
    t.string("title")
    t.nullable.string("content")
    t.boolean("published")
    t.nullable.field("author", {
      type: "User",
      resolve: parent =>
        prisma.post
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .author(),
    })
  },
})

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("post", {
      type: "Post",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.post.findUnique({
          where: { id: Number(args.postId) },
        })
      },
    })

    t.list.field("feed", {
      type: "Post",
      resolve: (_parent, _args) => {
        return prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field("categories", {
      type: "Category",
      resolve: (_parent, _args) => {
        return prisma.category.findMany()
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

    t.list.field("users", {
      type: "User",
      resolve: (_parent, _args, ctx) => {
        return prisma.user.findMany()
      },
    })

    t.list.field("stories", {
      type: "Story",
      resolve: (_parent, _args) => {
        return prisma.story.findMany({
          where: { publish: true },
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

    t.list.field("drafts", {
      type: "Post",
      resolve: (_parent, _args, ctx) => {
        return prisma.post.findMany({
          where: { published: false },
        })
      },
    })

    t.list.field("filterPosts", {
      type: "Post",
      args: {
        searchString: nullable(stringArg()),
      },
      resolve: (_, { searchString }, ctx) => {
        return prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("signupUser", {
      type: "User",
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
      },
      resolve: (_, { name, email }, ctx) => {
        return prisma.user.create({
          data: {
            name,
            email,
          },
        })
      },
    })

    t.nullable.field("deletePost", {
      type: "Post",
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.delete({
          where: { id: Number(postId) },
        })
      },
    })

    t.field("createDraft", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, content, authorEmail }, ctx) => {
        return prisma.post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })

    t.nullable.field("publish", {
      type: "Post",
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.update({
          where: { id: Number(postId) },
          data: { published: true },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Post,
    Favorite,
    Follow,
    Story,
    Category,
    User,
    GQLDate,
  ],
  outputs: {
    typegen: path.join(process.cwd(), "src/generated/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "src/generated/schema.graphql"),
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({ schema })

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

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === "OPTIONS") {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}

export default cors()(handler)
