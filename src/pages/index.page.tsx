import gql from "graphql-tag"
import type { NextPage } from "next"
import { Layout } from "src/components/Layout/Layout"
import { client } from "src/lib/apollo"
import type { QueryStories } from "src/types/Story/query"

const StoriesQuery = gql`
  query QueryStories($page: Int!, $pageSize: Int!) {
    QueryStories(page: $page, pageSize: $pageSize) {
      story_title
      story_synopsis
      story_categories
      story_image
      created_at
      viewing_restriction
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
    <div>
      <h1>My HomePage</h1>
      <main>
        {stories.QueryStories.map(story => (
          <div key={story.id}>
            <h2>{story.story_title}</h2>
            <p>{story.story_synopsis}</p>
            <img src={`${story.story_image}`} alt={`${story.story_title}`} />
          </div>
        ))}
      </main>
    </div>
  </Layout>
)

export default HomePage
