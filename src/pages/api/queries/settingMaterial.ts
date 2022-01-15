import type { ObjectDefinitionBlock } from "nexus/dist/core"
import { nonNull, nullable, stringArg } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import {
  authArgs,
  decodeUserId,
  defaultArgs,
  isSafe,
} from "src/pages/api/index.page"

const settingMaterialArgs = {
  searchTitle: nullable(stringArg()),
  searchUserId: nullable(stringArg()),
  serchStoryId: nullable(stringArg()),
  searchCategory: nullable(stringArg()),
}

const QuerySettingMaterials = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QuerySettingMaterials", {
    type: "SettingMaterial",
    args: {
      ...defaultArgs,
      ...settingMaterialArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const settingMaterials = await prisma.settingMaterial.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            setting_material_title: { search: args.searchTitle },
          }),
          ...(args.searchUserId && {
            user_id: { search: args.searchUserId },
          }),
          ...(args.serchStoryId && {
            story_id: { search: args.serchStoryId },
          }),
          publish: true,
        },
      })
      return settingMaterials
    },
  })
}

const QueryMySettingMaterials = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryMySettingMaterials", {
    type: "SettingMaterial",
    args: {
      accessToken: nonNull(stringArg()),
      ...defaultArgs,
      ...settingMaterialArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const settingMaterials = await prisma.settingMaterial.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            setting_material_title: { search: args.searchTitle },
          }),
          ...(args.serchStoryId && {
            story_id: { search: args.serchStoryId },
          }),
          user_id: `${decodeUserId(args.accessToken)}`,
        },
      })
      return settingMaterials
    },
  })
}

const QuerySettingMaterialById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QuerySettingMaterialById", {
    type: "SettingMaterial",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const settingMaterial = await prisma.settingMaterial.findUnique({
        where: {
          id: args.id,
        },
        select: {
          publish: true,
        },
      })
      return settingMaterial
    },
  })
}

const QueryMySettingMaterialById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryMySettingMaterialById", {
    type: "SettingMaterial",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      const settingMaterial = await prisma.settingMaterial.findUnique({
        where: {
          id: args.id,
        },
      })
      return isSafe(args.accessToken, args.userId) ? settingMaterial : null
    },
  })
}

const QuerySettingMaterialsCountByPublish = (
  t: ObjectDefinitionBlock<"Query">
) => {
  t.field("QuerySettingMaterialsCountByPublish", {
    type: "Int",

    resolve: async (_parent, _args) => {
      const count = await prisma.settingMaterial.count({
        where: {
          publish: true,
        },
      })
      return count
    },
  })
}

const QuerySettingMaterialsCountByUnPublish = (
  t: ObjectDefinitionBlock<"Query">
) => {
  t.field("QuerySettingMaterialsCountByUnPublish", {
    type: "Int",

    resolve: async (_parent, _args) => {
      const count = await prisma.settingMaterial.count({
        where: {
          publish: false,
        },
      })
      return count
    },
  })
}

export {
  QueryMySettingMaterialById,
  QueryMySettingMaterials,
  QuerySettingMaterialById,
  QuerySettingMaterials,
  QuerySettingMaterialsCountByPublish,
  QuerySettingMaterialsCountByUnPublish,
}
