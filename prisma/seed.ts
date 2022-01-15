/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma, PrismaClient } from "@prisma/client"

import {
  createCategories,
  createChapters,
  createEpisodes,
  createPages,
  createSeasons,
  createStories,
  createUsers,
} from "./fakers"

const prisma = new PrismaClient()

export const main = async () => {
  try {
    console.log(`Start seeding ...`)
    for (const u of createCategories()) {
      const story = await prisma.category.create({
        data: u,
      })
      console.log(`Created story with id: ${story.id}`)
    }
    console.log(`Seeding finished.`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
