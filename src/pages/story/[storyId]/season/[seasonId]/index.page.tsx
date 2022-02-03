/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { format } from "date-fns"
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
import { SeasonCard } from "src/components/blocks/Card/Season"
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
const StoryQueryById = gql`
  query QueryStoryById($queryStoryByIdId: String!) {
    QueryStoryById(id: $queryStoryByIdId) {
      id
      user_id
      story_title
      story_synopsis
      story_categories
      story_image
      publish
      viewing_restriction
      created_at
      updated_at
      seasons {
        id
        story_id
        season_title
        season_image
        created_at
      }
      favorites {
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
  story: QueryStoryById
  season: QuerySeasonById
  seasonId: string
}

export const getStaticPaths = async () => {
  const { data } = await client.query<QueryStories>({
    query: StoriesQuery,
    variables: {
      page: 1,
      pageSize: STORY_PAGE_SIZE,
    },
  })

  const paths = data.QueryStories.map(story =>
    story.seasons?.map(season => {
      return {
        params: {
          storyId: story.id,
          seasonId: season?.id,
        },
      }
    })
  )

  return {
    paths: paths.flat(),
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
  const { data: seasonData } = await client.query<QuerySeasonById>({
    query: SeasonQueryById,
    variables: {
      querySeasonByIdId: params?.seasonId,
    },
  })

  if (data.QueryStoryById.publish === false) {
    return {
      props: {
        story: {
          QueryStoryById: {
            id: null,
            story_title: "非公開のストーリー",
            story_synopsis: "非公開のストーリー",
            story_categories: [],
            story_image: "",
            viewing_restriction: "",
            publish: false,
            created_at: "",
            updated_at: "",
            user: null,
            seasons: [],
            reviews: [],
            favorites: [],
          },
        },
        season: {
          QuerySeasonById: {
            id: null,
            season_title: "非公開のシーズン",
            season_image: "",
            season_synopsis: "非公開のシーズン",
            publish: false,
            created_at: "",
            updated_at: "",
            episodes: [],
          },
        },
      },
    }
  }

  if (seasonData.QuerySeasonById.publish === false) {
    return {
      props: {
        story: data,
        season: {
          QuerySeasonById: {
            id: null,
            season_title: "非公開のシーズン",
            season_image: "",
            season_synopsis: "非公開のシーズン",
            publish: false,
            created_at: "",
            updated_at: "",
            episodes: [],
          },
        },
      },
    }
  }

  return {
    props: {
      story: data,
      season: seasonData,
      seasonId: params?.seasonId,
    },
    revalidate: 60,
  }
}

const StoryPage: NextPage<StoryPageProps> = ({ season, seasonId, story }) => {
  const currentOtherSeasons = story.QueryStoryById.seasons
    ? story.QueryStoryById.seasons.map(data => data)
    : []
  return (
    <Layout
      meta={{
        pageName: `StoryHub | ${story.QueryStoryById.story_title}のシーズン 「${season.QuerySeasonById.season_title}」`,
        description: `${season.QuerySeasonById.season_synopsis}`,
        cardImage: `${
          season.QuerySeasonById.season_image || "/img/StoryHubLogo.png"
        }`,
      }}
    >
      <div
        className="flex relative flex-col w-full min-h-[100vh]"
        style={{
          backgroundImage: `url(${
            story.QueryStoryById.story_image || "/img/StoryHubLogo.png"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="grid overflow-scroll absolute inset-0 p-8 w-full h-[100vh] bg-black/60"
          // style={{
          //   height: "calc(100vh - 64px)",
          // }}
        >
          <Tab
            color="purple"
            values={[
              {
                label: `${season.QuerySeasonById.season_title}`,
                children: (
                  <div className="flex flex-col justify-center items-center py-4 w-full">
                    <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
                      <div
                        className="overflow-hidden mb-8 w-[297px] h-[210px] bg-center bg-cover rounded-lg sm:w-[425px] sm:h-[300.38px] xl:w-[530.57px] xl:h-[375px]"
                        style={{
                          backgroundImage: `url(${
                            season.QuerySeasonById.season_image ||
                            "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
                          })`,
                        }}
                      />
                      <div className="flex flex-col w-full">
                        <h2 className="mb-4 text-2xl font-bold text-white">
                          {season.QuerySeasonById.season_title}
                        </h2>
                        <p className="mb-4 text-slate-200 whitespace-pre-wrap">
                          {season.QuerySeasonById.season_synopsis}
                        </p>
                        <p className="text-right text-slate-400">
                          {season.QuerySeasonById.created_at &&
                            format(
                              new Date(season.QuerySeasonById.created_at),
                              "yyyy/MM/dd"
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                label: "ストーリー",
                children: (
                  <div className="flex flex-col justify-center items-center py-4 w-full">
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
                          {story.QueryStoryById.story_categories?.map(
                            category => (
                              <span
                                key={category}
                                className="py-1 px-2 text-sm font-bold text-purple-500 bg-yellow-300 rounded-r-full rounded-bl-full"
                              >
                                {category}
                              </span>
                            )
                          )}
                        </div>
                        <h2 className="mb-4 text-2xl font-bold text-white">
                          {story.QueryStoryById.story_title}
                        </h2>
                        <p className="mb-4 text-slate-200 whitespace-pre-wrap">
                          {story.QueryStoryById.story_synopsis}
                        </p>
                        <p className="text-right text-slate-400">
                          {story.QueryStoryById.created_at &&
                            format(
                              new Date(story.QueryStoryById.created_at),
                              "yyyy/MM/dd"
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                label: `${currentOtherSeasons.length}個のシーズン`,
                children: (
                  <div className="flex flex-col items-center py-4 w-full">
                    {currentOtherSeasons && currentOtherSeasons.length > 0 ? (
                      <div className="flex flex-wrap gap-5 justify-center items-center w-full">
                        {currentOtherSeasons.map((season, index) => {
                          // eslint-disable-next-line no-console
                          console.log(season?.id, seasonId)
                          return (
                            <SeasonCard
                              characters={null}
                              created_at={undefined}
                              episodes={null}
                              id={null}
                              objects={null}
                              publish={null}
                              season_image={null}
                              season_synopsis={null}
                              season_title={null}
                              story={null}
                              story_id={null}
                              terminologies={null}
                              updated_at={undefined}
                              key={season?.id}
                              {...season}
                              seasonNumber={index + 1}
                              isCurrentSeason={season?.id === seasonId}
                            />
                          )
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-purple-500">
                          シーズンが存在しません
                        </h3>
                        <div
                          className="overflow-hidden mb-8 w-[210px] h-[297px] bg-center bg-cover rounded-lg sm:w-[300.38px] sm:h-[425px] xl:w-[375px] xl:h-[530.57px]"
                          style={{
                            backgroundImage: `url("https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png")`,
                          }}
                        />
                      </div>
                    )}
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
