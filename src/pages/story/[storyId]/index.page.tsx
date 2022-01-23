/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { format } from "date-fns"
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import { STORY_PAGE_SIZE } from "src/tools/page"
import type { QueryStories, QueryStoryById } from "src/types/Story/query"

const StoriesQuery = gql`
  query QueryStories($page: Int!, $pageSize: Int!) {
    QueryStories(page: $page, pageSize: $pageSize) {
      id
    }
  }
`
const StoryQueryById = gql`
  query QueryStoryById($queryStoryByIdId: String!) {
    QueryStoryById(id: $queryStoryByIdId) {
      id
      user_id
      story_title
      story_synopsis
      story_categories
      story_image
      viewing_restriction
      publish
      created_at
      updated_at
      user {
        user_name
        image
        user_deal
        id
      }
    }
  }
`

type StoryPageProps = {
  story: QueryStoryById
}

export const getStaticPaths = async () => {
  const { data } = await client.query<QueryStories>({
    query: StoriesQuery,
    variables: {
      page: 1,
      pageSize: STORY_PAGE_SIZE,
    },
  })

  return {
    paths: data.QueryStories.map(story => {
      return {
        params: {
          storyId: story.id,
        },
      }
    }),
    fallback: "blocking",
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context

  const { data } = await client.query<QueryStoryById>({
    query: StoryQueryById,
    variables: {
      queryStoryByIdId: params?.storyId,
    },
  })
  if (data.QueryStoryById.publish === false) {
    return {
      props: {
        story: {
          QueryStoryById: {
            id: "非公開のストーリー",
            story_title: "非公開のストーリー",
            story_synopsis: "非公開のストーリー",
            story_categories: [],
            story_image: "",
            viewing_restriction: "",
            publish: false,
            created_at: "",
            updated_at: "",
            user: null,
          },
        },
      },
    }
  }

  return {
    props: {
      story: data,
    },
    revalidate: 60,
  }
}

const StoryPage: NextPage<StoryPageProps> = ({ story }) => (
  <Layout
    meta={{
      pageName: `StoryHub | ${story.QueryStoryById?.user?.user_name}さんの作品。「${story.QueryStoryById.story_title}」`,
      description: `${story.QueryStoryById.story_synopsis}`,
      cardImage: `${
        story.QueryStoryById.story_image || "/img/StoryHubLogo.png"
      }`,
    }}
  >
    <div className="flex flex-col justify-center items-center p-8 w-full">
      <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
        <div
          className="overflow-hidden mb-8 w-[210px] h-[297px] bg-center bg-cover rounded-lg sm:w-[300.38px] sm:h-[425px] xl:w-[375px] xl:h-[530.57px]"
          style={{
            backgroundImage: `url(${
              story.QueryStoryById.story_image ||
              "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
            })`,
          }}
        />
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-3 mb-4">
            {story.QueryStoryById.story_categories?.map(category => (
              <span
                key={category}
                className="py-1 px-2 text-sm font-bold text-purple-500 bg-yellow-300 rounded-r-full rounded-bl-full"
              >
                {category}
              </span>
            ))}
          </div>
          <h2 className="mb-4 text-2xl font-black">
            {story.QueryStoryById.story_title}
          </h2>
          <p className="mb-4 text-slate-600 whitespace-pre-wrap">
            {story.QueryStoryById.story_synopsis}
          </p>
          <p className="text-right text-slate-400">
            {story.QueryStoryById.created_at &&
              format(new Date(story.QueryStoryById.created_at), "yyyy/MM/dd")}
          </p>
        </div>
      </div>
      <Tab
        color="purple"
        values={[
          {
            label: "シーズン",
            children: <div className="flex flex-col items-center">season</div>,
          },
          {
            label: "レビュー",
            children: <div className="flex flex-col items-center">review</div>,
          },
          {
            label: "お気に入り",
            children: <div className="flex flex-col items-center">setting</div>,
          },
        ]}
      />
    </div>
  </Layout>
)

export default StoryPage
