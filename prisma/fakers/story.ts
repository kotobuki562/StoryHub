import type { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createStories = (rows: number): Prisma.StoryCreateInput[] => {
  const data = []
  for (let i = 0; i < rows; i++) {
    data.push({
      user_id: "ef4310da-63c5-4dec-8616-51a032479c54",
      story_title: faker.lorem.sentence(),
      story_synopsis: faker.lorem.paragraph(),
      story_image: faker.image.imageUrl(),
      story_categories: ["フィクション", "SF", "ホラー"],
      publish: Math.random() > 0.5,
    })
  }
  return data
}

export { createStories }
