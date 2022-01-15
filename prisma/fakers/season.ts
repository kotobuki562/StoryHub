import type { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createSeasons = (): Prisma.SeasonCreateInput[] => {
  const data = []
  for (let i = 0; i < 5; i++) {
    data.push({
      story_id: "3e10aa5f-95a8-47b6-915a-c61e03bf7058",
      season_title: faker.lorem.sentence(),
      season_image: faker.image.imageUrl(),
      season_synopsis: faker.lorem.paragraph(),
      publish: true,
    })
  }
  return data
}

export { createSeasons }
