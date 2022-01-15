import type { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createChapters = (): Prisma.ChapterCreateInput[] => {
  const data = []
  for (let i = 0; i < 3; i++) {
    data.push({
      episode_id: "17a42bfb-49ee-4c54-902f-707d381263c5",
      chapter_title: faker.lorem.sentence(),
      chapter_image: faker.image.imageUrl(),
      publish: true,
    })
  }
  return data
}

export { createChapters }
