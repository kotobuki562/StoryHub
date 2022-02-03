/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { useQuery } from "@apollo/client"
import { PencilAltIcon, XCircleIcon } from "@heroicons/react/solid"
import cc from "classcat"
import { format } from "date-fns"
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ReviewCard } from "src/components/blocks/Card/ReviewByStory"
import { SeasonCard } from "src/components/blocks/Card/Season"
import { Modal } from "src/components/blocks/Modal"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import { supabase } from "src/lib/supabase"
import { REVIEW_PAGE_SIZE_BY_STORY, STORY_PAGE_SIZE } from "src/tools/page"
import type { QueryReviewsByStoryId } from "src/types/Review/query"
import type { QueryStories, QueryStoryById } from "src/types/Story/query"

import { CreateReviewForm } from "./createReview"

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
const ReviewsQueryByStoryId = gql`
  query QueryReviewsByStoryId($storyId: String!, $page: Int, $pageSize: Int) {
    QueryReviewsByStoryId(storyId: $storyId, page: $page, pageSize: $pageSize) {
      id
      user_id
      review_title
      review_body
      stars
      created_at
      user {
        id
        user_name
        image
      }
    }
  }
`

const ReviewCountQueryByStoryId = gql`
  query Query($storyId: String!) {
    QueryReviewsCountByStoryId(storyId: $storyId)
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
            seasons: [],
            reviews: [],
            favorites: [],
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

const StoryPage: NextPage<StoryPageProps> = ({ story }) => {
  const [reviews, setReviews] = useState<
    QueryReviewsByStoryId["QueryReviewsByStoryId"]
  >([])
  const [page, setPage] = useState(1)
  const { data: reviewCountData } = useQuery<{
    QueryReviewsCountByStoryId: number
  }>(ReviewCountQueryByStoryId, {
    variables: {
      storyId: story.QueryStoryById.id,
    },
  })

  const getPageReviewData = useCallback(async () => {
    const { data } = await client.query<QueryReviewsByStoryId>({
      query: ReviewsQueryByStoryId,
      variables: {
        storyId: story.QueryStoryById.id,
        page: page,
        pageSize: REVIEW_PAGE_SIZE_BY_STORY,
      },
    })

    setReviews(pre => {
      return [...pre, ...data.QueryReviewsByStoryId]
    })
  }, [page, story.QueryStoryById.id])

  useEffect(() => {
    getPageReviewData()
  }, [getPageReviewData])

  const user = supabase.auth.user()
  const isCreateReview = useMemo(() => {
    return !!reviews?.find(review => {
      return review?.user_id === user?.id
    })
  }, [reviews, user?.id])
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false)
  }, [])

  return (
    <Layout
      meta={{
        pageName: `SうにtoryHub | ${story.QueryStoryById?.user?.user_name}さんの作品。「${story.QueryStoryById.story_title}」`,
        description: `${story.QueryStoryById.story_synopsis}`,
        cardImage: `${
          story.QueryStoryById.story_image || "/img/StoryHubLogo.png"
        }`,
      }}
    >
      <div className="flex flex-col justify-center items-center p-8 w-full">
        {story.QueryStoryById.story_title !== "非公開のストーリー" && user?.id && (
          <>
            <div className="fixed right-5 bottom-5 z-10">
              <button
                onClick={handleOpenModal}
                className="flex flex-col justify-center items-center p-2 w-16 h-16 text-yellow-300 bg-purple-500 rounded-full focus:ring-2 ring-purple-300 duration-200 sm:p-4 sm:w-20 sm:h-20"
              >
                <PencilAltIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              </button>
            </div>
            <Modal
              isOpen={isOpenModal}
              onClose={handleCloseModal}
              header={
                <div className="flex items-center h-full">
                  <div className="p-4 font-bold text-white bg-purple-500">
                    <PencilAltIcon className="w-8 h-8" />
                  </div>
                  <p className="overflow-y-scroll px-4 max-h-[64px] text-base font-bold text-purple-500 sm:text-2xl no-scrollbar">
                    {story.QueryStoryById.story_title}のレビューを作成
                  </p>
                </div>
              }
              footer={
                <div className="flex items-center h-full">
                  <p className="overflow-y-scroll px-4 max-h-[64px] text-base font-bold text-purple-500 sm:text-2xl no-scrollbar">
                    {story.QueryStoryById.story_title}のレビューを作成
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="p-4 font-bold text-white bg-purple-500 no-scrollbar"
                  >
                    <XCircleIcon className="w-8 h-8" />
                  </button>
                </div>
              }
            >
              <CreateReviewForm
                isCreateReview={isCreateReview}
                userId={user.id}
              />
            </Modal>
          </>
        )}

        <Tab
          color="purple"
          values={[
            {
              label: `${story.QueryStoryById.story_title}`,
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
                          category => {
                            return (
                              <span
                                key={category}
                                className="py-1 px-2 text-sm font-bold text-purple-500 bg-yellow-300 rounded-r-full rounded-bl-full"
                              >
                                {category}
                              </span>
                            )
                          }
                        )}
                      </div>
                      <h2 className="mb-4 text-2xl font-black">
                        {story.QueryStoryById.story_title}
                      </h2>
                      <p className="mb-4 text-slate-600 whitespace-pre-wrap">
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
              label: `${story.QueryStoryById?.seasons?.length}個のシーズン`,
              children: (
                <div className="flex flex-col items-center py-4 w-full">
                  {story.QueryStoryById.seasons &&
                  story.QueryStoryById.seasons.length > 0 ? (
                    <div className="flex flex-wrap gap-5 justify-center items-center w-full">
                      {story.QueryStoryById.seasons?.map((season, index) => {
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
            {
              label: `${reviewCountData?.QueryReviewsCountByStoryId}件のレビュー`,
              children: (
                <div className="flex flex-col items-center py-4 w-full">
                  {reviews && reviews.length > 0 ? (
                    <div className="justify-center items-center w-full">
                      <div
                        className={cc([
                          "grid gap-1 justify-center items-center w-full bg-purple-100",
                          // reviews.lengthが3の倍数だったら, grid-cols-3にする
                          reviews.length % 3 === 0
                            ? "grid-cols-1 lg:grid-cols-3"
                            : "grid-cols-1",
                          // reviews.lengthが2の倍数だったら, grid-cols-2にする
                          reviews.length % 2 === 0
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-1",
                        ])}
                      >
                        {reviews?.map(review => {
                          return <ReviewCard key={review?.id} {...review} />
                        })}
                      </div>
                      {/* handleChangePageSizeのボタンをつける */}
                      {reviewCountData?.QueryReviewsCountByStoryId &&
                        reviews.length <
                          reviewCountData?.QueryReviewsCountByStoryId &&
                        reviews.length <=
                          reviewCountData?.QueryReviewsCountByStoryId && (
                          <div className="flex justify-center items-center">
                            <button
                              className="py-2 px-4 font-bold text-white bg-purple-500 hover:bg-purple-700 rounded"
                              onClick={() => {
                                setPage(pre => {
                                  return pre + 1
                                })
                              }}
                            >
                              次の{REVIEW_PAGE_SIZE_BY_STORY}件
                            </button>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-bold text-purple-500">
                        レビューが存在しません
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
            {
              label: `${story.QueryStoryById?.favorites?.length}個のブックマーク`,
              children: (
                <div className="flex flex-col items-center py-4">
                  {story.QueryStoryById.favorites &&
                  story.QueryStoryById.favorites.length > 0 ? null : (
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-bold text-purple-500">
                        ブックマークが存在しません
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
    </Layout>
  )
}

export default StoryPage
