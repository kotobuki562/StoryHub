import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, defaultArgs, isSafe } from "src/pages/api/index.page"

const terminologyArgs = {
  searchTitle: nullable(stringArg()),
  serchSettingMaterialId: nullable(stringArg()),
}

const QueryTerminologies = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryTerminologies", {
    type: "Terminology",
    args: {
      ...terminologyArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const terminologies = await prisma.terminology.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            terminology_name: { search: args.searchTitle },
          }),
          ...(args.serchSettingMaterialId && {
            setting_material_id: args.serchSettingMaterialId,
          }),
          publish: true,
        },
      })
      return terminologies
    },
  })
}

const QueryMyTerminologies = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryMyTerminologies", {
    type: "Terminology",
    args: {
      ...terminologyArgs,
      ...defaultArgs,
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const terminologies = await prisma.terminology.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
        where: {
          ...(args.searchTitle && {
            terminology_name: { search: args.searchTitle },
          }),
          ...(args.serchSettingMaterialId && {
            setting_material_id: args.serchSettingMaterialId,
          }),
        },
      })
      return isSafe(args.accessToken, args.userId) ? terminologies : []
    },
  })
}

const QueryTerminologyById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryTerminologyById", {
    type: "Terminology",
    args: {
      terminologyId: nonNull(stringArg()),
    },
    resolve: async (_parent, args) => {
      const terminology = await prisma.terminology.findUnique({
        where: {
          id: args.terminologyId,
        },
      })
      return terminology
    },
  })
}

const QueryMyTerminologyById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryMyTerminologyById", {
    type: "Terminology",
    args: {
      terminologyId: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      const terminology = await prisma.terminology.findUnique({
        where: {
          id: args.terminologyId,
        },
      })
      return isSafe(args.accessToken, args.userId) ? terminology : null
    },
  })
}

const QueryTerminologiesCountByPublish = (
  t: ObjectDefinitionBlock<"Query">
) => {
  t.field("QueryTerminologiesCountByPublish", {
    type: "Int",
    resolve: async _parent => {
      const terminologies = await prisma.terminology.count({
        where: {
          publish: true,
        },
      })
      return terminologies
    },
  })
}

const QueryTerminologiesCountByUnPublish = (
  t: ObjectDefinitionBlock<"Query">
) => {
  t.field("QueryTerminologiesCountByUnPublish", {
    type: "Int",
    resolve: async _parent => {
      const terminologies = await prisma.terminology.count({
        where: {
          publish: false,
        },
      })
      return terminologies
    },
  })
}

export {
  QueryMyTerminologies,
  QueryMyTerminologyById,
  QueryTerminologies,
  QueryTerminologiesCountByPublish,
  QueryTerminologiesCountByUnPublish,
  QueryTerminologyById,
}
