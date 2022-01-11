import { nonNull, nullable, stringArg, list } from "nexus"
import { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import supabase from "src/lib/supabase"
import { decodeUserId } from "../index.page"

const signupUser = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("signupUser", {
    type: "User",
    args: {
      userName: stringArg(),
      email: nonNull(stringArg()),
      password: nonNull(stringArg()),
    },
    resolve: async (_, args, ctx) => {
      return await supabase.auth
        .signUp({
          email: args.email,
          password: args.password,
        })
        .then(res => {
          return prisma.user.create({
            data: {
              id: `${res?.user?.id}`,
              user_name: `${args.userName}`,
            },
          })
        })
        .catch(error => {
          throw new Error(error)
        })
    },
  })
}

const createUser = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("createUser", {
    type: "User",
    args: {
      userName: nonNull(stringArg()),
      userDeal: nonNull(stringArg()),
      links: nullable(list(stringArg())),
      image: nullable(stringArg()),
      accessToken: nonNull(stringArg()),
    },
    resolve: (_, args, ctx) => {
      return prisma.user.create({
        data: {
          id: `${decodeUserId(args.accessToken)}`,
          user_name: `${args.userName}`,
          user_deal: `${args.userDeal}`,
          links: `${args.links}`,
          image: `${args.image}`,
        },
      })
    },
  })
}

const updateUser = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateUser", {
    type: "User",
    args: {
      userName: nonNull(stringArg()),
      userDeal: nonNull(stringArg()),
      links: nullable(list(stringArg())),
      image: nullable(stringArg()),
      accessToken: nonNull(stringArg()),
    },
    resolve: (_, args, ctx) => {
      return prisma.user.update({
        where: {
          id: `${decodeUserId(args.accessToken)}`,
        },
        data: {
          user_name: `${args.userName}`,
          user_deal: `${args.userDeal}`,
          links: `${args.links}`,
          image: `${args.image}`,
        },
      })
    },
  })
}

const deleteUser = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteUser", {
    type: "User",
    args: {
      accessToken: nonNull(stringArg()),
    },
    resolve: (_, args, ctx) => {
      return prisma.user.delete({
        where: {
          id: `${decodeUserId(args.accessToken)}`,
        },
      })
    },
  })
}

export { signupUser, createUser, updateUser, deleteUser }