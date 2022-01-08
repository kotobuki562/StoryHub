import { Prisma } from "@prisma/client"
import faker from "@withshepherd/faker"

const createUsers = (): Prisma.UserCreateInput[] => {
  const data = []
  for (let i = 0; i < 3; i++) {
    data.push({
      user_name: faker.name.firstName(),
      user_deal: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
    })
  }
  return data
}

export { createUsers }
