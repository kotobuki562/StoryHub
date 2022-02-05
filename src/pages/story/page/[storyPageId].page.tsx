/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
import { StoryCard } from "src/components/blocks/Card"
import { Pagination } from "src/components/blocks/Pagination"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import { STORY_PAGE_SIZE } from "src/tools/page"
import type {
  QueryStories,
  QueryStoriesCountByPublish,
} from "src/types/Story/query"

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

const PublishStoriesQuery = gql`
  query Query {
    QueryStoriesCountByPublish
  }
`
type HomePageProps = {
  stories: QueryStories
  publishStoriesCount: number
}

export const getStaticPaths = async () => {
  const totalCount = await client.query<QueryStoriesCountByPublish>({
    query: PublishStoriesQuery,
  })

  const range = (start: number, end: number) => {
    return [...Array(end - start + 1)].map((_, i) => {
      return start + i
    })
  }
  const paths = range(
    1,
    Math.ceil(totalCount.data.QueryStoriesCountByPublish / STORY_PAGE_SIZE)
  ).map(repo => {
    return {
      params: {
        storyPageId: repo.toString(),
      },
    }
  })
  return { paths, fallback: false }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context

  const data = await client.query<QueryStories>({
    query: StoriesQuery,
    variables: {
      page: Number(params?.storyPageId),
      pageSize: STORY_PAGE_SIZE,
    },
  })
  const totalCount = await client.query<QueryStoriesCountByPublish>({
    query: PublishStoriesQuery,
  })

  return {
    props: {
      stories: data.data,
      publishStoriesCount: totalCount.data.QueryStoriesCountByPublish,
    },
    revalidate: 60,
  }
}

const HomePage: NextPage<HomePageProps> = ({
  publishStoriesCount,
  stories,
}) => {
  return (
    <Layout
      meta={{
        pageName: `StoryHub | 妄想を、吐き出せ`,
        description: `StoryHubはあなたの思い描いた物語を自由に創作するプラットフォームです。あなたも今すぐ「妄想を、吐き出せ」`,
        cardImage: `/img/StoryHubLogo.png`,
      }}
    >
      <div className="p-8">
        <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
          {stories.QueryStories.map(story => {
            return <StoryCard key={story.id} {...story} />
          })}
        </div>
        <Pagination
          totalCount={publishStoriesCount}
          usecase="story"
          page={STORY_PAGE_SIZE}
        />
      </div>
    </Layout>
  )
}

export default HomePage
