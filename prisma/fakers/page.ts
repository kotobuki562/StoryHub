import type { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createPages = (): Prisma.PageCreateInput[] => {
  const data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      chapter_id: "b6b3dd6a-12c2-4a91-b68b-ea4b221b4796",
      page_body: faker.lorem.paragraph(),
    })
  }
  return data
}

export { createPages }
