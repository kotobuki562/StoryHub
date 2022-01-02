import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    user_name: "Alice",
    user_deal: "Alice's Deal",
    links: [
      {
        social: "facebook",
        link: "https://www.facebook.com/alice.alice",
      },
      {
        social: "twitter",
        link: "https://www.twitter.com/alice.alice",
      },
    ],
  },
  {
    user_name: "Nilu",
    user_deal: "Nilu's Deal",
    links: [
      {
        social: "facebook",
        link: "https://www.facebook.com/nilu.nilu",
      },
    ],
  },
  {
    user_name: "Mahmoud",
    user_deal: "Mahmoud's Deal",
  },
]

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    category_title: "サスペンス",
  },
  {
    category_title: "アクション",
  },
  {
    category_title: "SF",
  },
]

export async function main() {
  try {
    console.log(`Start seeding ...`)
    for (const u of userData) {
      const user = await prisma.user.create({
        data: u,
      })
      console.log(`Created user with id: ${user.id}`)
    }
    for (const u of categoryData) {
      const category = await prisma.category.create({
        data: u,
      })
      console.log(`Created category with id: ${category.id}`)
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
