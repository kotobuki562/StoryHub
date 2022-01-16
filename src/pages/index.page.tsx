/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import gql from "graphql-tag"
import type { NextPage } from "next"
import { StoryCard } from "src/components/blocks/Card"
import { Layout } from "src/components/Layout/Layout"
import { client } from "src/lib/apollo"
import type { QueryStories } from "src/types/Story/query"

const StoriesQuery = gql`
  query QueryStories($page: Int!, $pageSize: Int!) {
    QueryStories(page: $page, pageSize: $pageSize) {
      id
      story_title
      story_synopsis
      story_categories
      story_image
      viewing_restriction
      created_at
      user {
        user_name
        image
      }
    }
  }
`

type HomePageProps = {
  stories: QueryStories
}

export const getStaticProps = async () => {
  const data = await client.query<QueryStories>({
    query: StoriesQuery,
    variables: {
      page: 1,
      pageSize: 10,
    },
  })

  return {
    props: {
      stories: data.data,
    },
    revalidate: 60,
  }
}

const HomePage: NextPage<HomePageProps> = ({ stories }) => (
  // const {
  //   data,
  //   error,
  //   loading: isLoading,
  // } = useQuery<QueryStory>(StoriesQuery, {
  //   variables: {
  //     page: 1,
  //     pageSize: 10,
  //   },
  //   fetchPolicy: "cache-and-network",
  // })

  <Layout
    meta={{
      pageName: `StoryHub | 妄想を、吐き出せ`,
      description: `StoryHubはあなたの思い描いた物語を自由に創作するプラットフォームです。あなたも今すぐ「妄想を、吐き出せ」`,
      cardImage: `/img/StoryHubLogo.png`,
    }}
  >
    <div className="p-8">
      <div className="flex flex-wrap gap-8 justify-center w-full">
        {stories.QueryStories.map(story => (
          <StoryCard key={story.id} {...story} />
        ))}
      </div>
    </div>
  </Layout>
)

export default HomePage
