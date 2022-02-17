import type { PrismaClient } from "@prisma/client"
// import type { PubSub } from "graphql-subscriptions"
import prisma from "src/lib/prisma"

export interface Context {
  prisma: PrismaClient
}

export const createContext = async (): Promise<Context> => {
  return {
    prisma,
  }
}
