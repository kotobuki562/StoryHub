import { PrismaClient, Prisma } from "@prisma/client"
import {
  createSeasons,
  createCategories,
  createUsers,
  createStories,
  createEpisodes,
  createChapters,
  createPages,
} from "./fakers"

const prisma = new PrismaClient()

export async function main() {
  try {
    console.log(`Start seeding ...`)
    for (const u of createStories(1000)) {
      const story = await prisma.story.create({
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