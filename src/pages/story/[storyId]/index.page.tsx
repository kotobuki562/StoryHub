/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { PencilAltIcon } from "@heroicons/react/solid"
import { format } from "date-fns"
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
import { useCallback, useMemo, useState } from "react"
import { Modal } from "src/components/blocks/Modal"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import { supabase } from "src/lib/supabase"
import { STORY_PAGE_SIZE } from "src/tools/page"
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
        season_synopsis
        publish
        created_at
        updated_at
      }
      reviews {
        id
        user_id
        story_id
        review_title
        review_body
        stars
      }
      favorites {
        id
        user {
          id
          user_name
          image
        }
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
  const user = supabase.auth.user()
  const isCreateReview = useMemo(
    () =>
      !!story.QueryStoryById.reviews?.find(
        review => review?.user_id === user?.id
      ),
    [story.QueryStoryById.reviews, user?.id]
  )
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
        {story.QueryStoryById.story_title !== "非公開のストーリー" &&
          user?.id &&
          !isCreateReview && (
            <>
              <div className="fixed right-5 bottom-5">
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
                title={`${story.QueryStoryById.story_title}のレビュー`}
              >
                <CreateReviewForm userId={user.id} />
              </Modal>
            </>
          )}

        <Tab
          color="purple"
          values={[
            {
              label: "シーズン",
              children: (
                <div className="flex flex-col items-center">
                  {story.QueryStoryById.seasons?.length}
                </div>
              ),
            },
            {
              label: "レビュー",
              children: (
                <div className="flex flex-col items-center">
                  {story.QueryStoryById.reviews?.length}
                </div>
              ),
            },
            {
              label: "お気に入り",
              children: (
                <div className="flex flex-col items-center">
                  {story.QueryStoryById.favorites?.length}
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
