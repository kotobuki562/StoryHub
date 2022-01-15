import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, defaultArgs, isSafe } from "src/pages/api/index.page"

const objectArgs = {
  searchTitle: nullable(stringArg()),
  serchSettingMaterialId: nullable(stringArg()),
}

const QueryObjects = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryObjects", {
    type: "Object",
    args: {
      ...objectArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const objects = await prisma.object.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            object_name: { search: args.searchTitle },
          }),
          ...(args.serchSettingMaterialId && {
            setting_material_id: args.serchSettingMaterialId,
          }),
          publish: true,
        },
      })
      return objects
    },
  })
}

const QueryMyObjects = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryMyObjects", {
    type: "Object",
    args: {
      ...objectArgs,
      ...defaultArgs,
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const objects = await prisma.object.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            object_name: { search: args.searchTitle },
          }),
          ...(args.serchSettingMaterialId && {
            setting_material_id: args.serchSettingMaterialId,
          }),
        },
      })
      return isSafe(args.accessToken, args.userId) ? objects : []
    },
  })
}

const QueryObjectById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryObjectById", {
    type: "Object",
    args: {
      objectId: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const object = await prisma.object.findUnique({
        where: {
          id: args.objectId,
        },
      })
      return object
    },
  })
}

const QueryMyObjectById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryMyObjectById", {
    type: "Object",
    args: {
      objectId: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      const object = await prisma.object.findUnique({
        where: {
          id: args.objectId,
        },
      })
      return isSafe(args.accessToken, args.userId) ? object : null
    },
  })
}

const QueryObjectsCountByPublish = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryObjectsCountByPublish", {
    type: "Int",
    resolve: async _parent => {
      const objects = await prisma.object.count({
        where: {
          publish: true,
        },
      })
      return objects
    },
  })
}

const QueryObjectsCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryObjectsCountByUnPublish", {
    type: "Int",
    resolve: async _parent => {
      const objects = await prisma.object.count({
        where: {
          publish: false,
        },
      })
      return objects
    },
  })
}

export {
  QueryMyObjectById,
  QueryMyObjects,
  QueryObjectById,
  QueryObjects,
  QueryObjectsCountByPublish,
  QueryObjectsCountByUnPublish,
}
