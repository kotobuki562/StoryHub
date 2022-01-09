import { PubSub } from "graphql-subscriptions"
import { PrismaClient } from "@prisma/client"

export interface Context {
  prisma: PrismaClient
  pubsub: PubSub
}

const prisma = new PrismaClient()
const pubsub = new PubSub()

export const context: Context = {
  prisma: prisma,
  pubsub: pubsub,
}
