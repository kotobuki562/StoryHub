/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from "@prisma/client"

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient
    }
  }
}

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient({
      log: [
        {
          emit: "stdout",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "info",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ],
    })
  }
  // @ts-ignore
  prisma = global.prisma
}

export default prisma
