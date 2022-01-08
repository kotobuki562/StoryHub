import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

const storyData = (): Prisma.StoryCreateInput[] => {
  const data = []
  for (let i = 0; i < 3; i++) {
    data.push({
      user_id: "8e5fc6d0-520b-4585-aac7-77c7758fb00d",
      story_title: `Story${i + 1}`,
      story_synopsis: `Story ${i + 1} content`,
      story_image: `Story ${i + 1} image`,
    })
  }
  return data
}

export async function main() {
  try {
    console.log(`Start seeding ...`)
    for (const u of storyData()) {
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
