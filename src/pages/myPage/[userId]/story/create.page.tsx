import type { NextPage } from "next"
import { memo } from "react"
import { Layout } from "src/components/Layout"

const CreateStoryPage: NextPage = () => (
  <Layout>
    <div className="p-8"></div>
  </Layout>
)

// eslint-disable-next-line import/no-default-export
export default memo(CreateStoryPage)
