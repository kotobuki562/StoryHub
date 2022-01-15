import { nonNull, nullable, stringArg } from "nexus"
import type { ObjectDefinitionBlock } from "nexus/dist/core"
import prisma from "src/lib/prisma"
import { authArgs, defaultArgs, isSafe } from "src/pages/api/index.page"

const characterArgs = {
  searchTitle: nullable(stringArg()),
  serchSettingMaterialId: nullable(stringArg()),
}

const QueryCharacters = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryCharacters", {
    type: "Character",
    args: {
      ...characterArgs,
      ...defaultArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const characters = await prisma.character.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "asc" },
        where: {
          ...(args.searchTitle && {
            character_name: { search: args.searchTitle },
          }),
          ...(args.serchSettingMaterialId && {
            setting_material_id: args.serchSettingMaterialId,
          }),
          publish: true,
        },
      })
      return characters
    },
  })
}

const QueryMyCharacters = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("QueryMyCharacters", {
    type: "Character",
    args: {
      ...characterArgs,
      ...defaultArgs,
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      const { page, pageSize } = args
      const skip = pageSize * (Number(page) - 1)
      const characters = await prisma.character.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "asc" },
        where: {
          ...(args.searchTitle && {
            character_name: { search: args.searchTitle },
          }),
          ...(args.serchSettingMaterialId && {
            setting_material_id: args.serchSettingMaterialId,
          }),
        },
      })
      return isSafe(args.accessToken, args.userId) ? characters : []
    },
  })
}

const QueryCharacterById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryCharacterById", {
    type: "Character",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: (_parent, args) => {
      const character = prisma.character.findUnique({
        where: {
          id: args.id,
        },
      })
      return character
    },
  })
}

const QueryMyCharacterById = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryMyCharacterById", {
    type: "Character",
    args: {
      id: nonNull(stringArg()),
      ...authArgs,
    },
    resolve: async (_parent, args) => {
      const character = await prisma.character.findUnique({
        where: {
          id: args.id,
        },
      })
      return isSafe(args.accessToken, args.userId) ? character : null
    },
  })
}

const QueryCharactersCountByPublish = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryCharactersCountByPublish", {
    type: "Int",
    resolve: async _parent => {
      const characters = await prisma.character.count({
        where: {
          publish: true,
        },
      })
      return characters
    },
  })
}

const QueryCharactersCountByUnPublish = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("QueryCharactersCountByUnPublish", {
    type: "Int",
    resolve: async _parent => {
      const characters = await prisma.character.count({
        where: {
          publish: false,
        },
      })
      return characters
    },
  })
}

export {
  QueryCharacterById,
  QueryCharacters,
  QueryCharactersCountByPublish,
  QueryCharactersCountByUnPublish,
  QueryMyCharacterById,
  QueryMyCharacters,
}
