import { objectType } from "nexus"

const Category = objectType({
  name: "Category",
  definition(t) {
    t.int("id")
    t.nullable.string("category_title")
    t.date("created_at")
  },
})

export { Category }
