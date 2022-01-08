import { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createStories = (): Prisma.StoryCreateInput[] => {
  const data = []
  for (let i = 0; i < 3; i++) {
    data.push({
      user_id: "144a7aae-cd33-41b0-8c3f-fec71bb1f9e3",
      story_title: faker.lorem.sentence(),
      story_synopsis: faker.lorem.paragraph(),
      story_image: faker.image.imageUrl(),
    })
  }
  return data
}

export { createStories }
