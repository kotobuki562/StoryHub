import type { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createEpisodes = (): Prisma.EpisodeCreateInput[] => {
  const data = []
  for (let i = 0; i < 5; i++) {
    data.push({
      season_id: "0e5c5337-6d2f-46ac-8f06-ef192f75866e",
      episode_title: faker.lorem.sentence(),
      episode_synopsis: faker.lorem.paragraph(),
      episode_image: faker.image.imageUrl(),
      publish: true,
    })
  }
  return data
}

export { createEpisodes }
