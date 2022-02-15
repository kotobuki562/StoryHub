/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { format } from "date-fns"
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
import Link from "next/link"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import { STORY_PAGE_SIZE } from "src/tools/page"
import type { QuerySeasonById } from "src/types/Season/query"
import type { QueryStories, QueryStoryById } from "src/types/Story/query"

const StoriesQuery = gql`
  query QueryStories($page: Int!, $pageSize: Int!) {
    QueryStories(page: $page, pageSize: $pageSize) {
      id
      seasons {
        id
      }
    }
  }
`

const SeasonQueryById = gql`
  query Query($querySeasonByIdId: String!) {
    QuerySeasonById(id: $querySeasonByIdId) {
      id
      story_id
      season_title
      season_image
      season_synopsis
      publish
      created_at
      updated_at
      story {
        id
        story_image
        story_title
        publish
      }
      episodes {
        id
        episode_title
        season_id
        episode_image
        episode_synopsis
        publish
        created_at
        updated_at
      }
    }
  }
`

type StoryPageProps = {
  story: QueryStoryById["QueryStoryById"]
  season: QuerySeasonById["QuerySeasonById"]
}

export const getStaticPaths = async () => {
  const { data } = await client.query<QueryStories>({
    query: StoriesQuery,
    variables: {
      page: 1,
      pageSize: STORY_PAGE_SIZE,
    },
  })

  const paths = data.QueryStories.map(story => {
    return story.seasons?.map(season => {
      return {
        params: {
          storyId: story.id,
          seasonId: season?.id,
        },
      }
    })
  })

  return {
    paths: paths.flat(),
    fallback: "blocking",
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context

  const { data: seasonData } = await client.query<QuerySeasonById>({
    query: SeasonQueryById,
    variables: {
      querySeasonByIdId: params?.seasonId,
    },
  })

  if (seasonData?.QuerySeasonById?.story?.publish === true) {
    return {
      props: {
        story: seasonData.QuerySeasonById.story,
        season: seasonData.QuerySeasonById,
        seasonId: params?.seasonId,
      },
      revalidate: 60,
    }
  }
}

const StoryPage: NextPage<StoryPageProps> = ({ season, story }) => {
  return (
    <Layout
      meta={{
        pageName: `StoryHub | ${story.story_title}のシーズン 「${season.season_title}」`,
        description: `${season.season_synopsis}`,
        cardImage: `${season.season_image || "/img/StoryHubLogo.png"}`,
      }}
    >
      <div
        className="flex relative flex-col w-full"
        style={{
          backgroundImage: `url(${
            season.season_image || "/img/StoryHubLogo.png"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "calc(100vh - 64px)",
        }}
      >
        <div
          className="overflow-scroll absolute inset-0 p-8 w-full bg-black/60 backdrop-blur"
          style={{
            height: "calc(100vh - 64px)",
          }}
        >
          <div className="flex mb-8 w-full">
            <Link href={`/story/${story.id}`}>
              <a className="flex flex-col items-center text-sm text-white">
                <img
                  className="object-cover w-[50.96px] h-[72px] rounded-md"
                  src={story?.story_image || "/img/StoryHubLogo.png"}
                />
                <p>
                  {story.story_title && story.story_title.length > 10
                    ? `${story.story_title?.slice(0, 10)}...`
                    : story.story_title}
                </p>
              </a>
            </Link>
          </div>

          <Tab
            color="purple"
            values={[
              {
                label: `${season.season_title}`,
                children: (
                  <div className="flex flex-col justify-center items-center py-4 w-full">
                    <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
                      <div
                        className="overflow-hidden mb-8 w-[297px] h-[210px] bg-center bg-cover rounded-lg sm:w-[425px] sm:h-[300.38px] xl:w-[530.57px] xl:h-[375px]"
                        style={{
                          backgroundImage: `url(${
                            season.season_image ||
                            "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
                          })`,
                        }}
                      />
                      <div className="flex flex-col w-full">
                        <h2 className="mb-4 text-2xl font-bold text-white">
                          {season.season_title}
                        </h2>
                        <p className="mb-4 text-slate-200 whitespace-pre-wrap">
                          {season.season_synopsis}
                        </p>
                        <p className="font-mono text-right text-slate-400">
                          {season.created_at &&
                            format(new Date(season.created_at), "yyyy/MM/dd")}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </Layout>
  )
}

export default StoryPage
