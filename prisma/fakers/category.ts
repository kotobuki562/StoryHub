import { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createCategories = (): Prisma.CategoryCreateInput[] => {
  const data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      category_title: faker.lorem.sentence(),
    })
  }
  return data
}

export { createCategories }
