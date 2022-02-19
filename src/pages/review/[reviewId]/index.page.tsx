/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { StarIcon } from "@heroicons/react/solid"
import cc from "classcat"
import { format } from "date-fns"
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
import Link from "next/link"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import type { Star } from "src/tools/options"
import { reviewStars, reviewState } from "src/tools/options"
import { REVIEW_PAGE_SIZE } from "src/tools/page"
import type { QueryReviewById, QueryReviews } from "src/types/Review/query"
import type { QueryStoryById } from "src/types/Story/query"

const ReviewQuery = gql`
  query QueryReviews($pageSize: Int, $page: Int) {
    QueryReviews(pageSize: $pageSize, page: $page) {
      id
    }
  }
`

const ReviewsQueryById = gql`
  query QueryReviewById($queryReviewByIdId: String!) {
    QueryReviewById(id: $queryReviewByIdId) {
      id
      user_id
      story_id
      review_title
      review_body
      stars
      created_at
      story {
        story_title
        story_synopsis
        story_image
        publish
        viewing_restriction
        story_categories
        created_at
      }
      user {
        user_name
        image
      }
    }
  }
`

type StoryPageProps = {
  story: QueryStoryById["QueryStoryById"]
  review: QueryReviewById
}

export const getStaticPaths = async () => {
  const { data } = await client.query<QueryReviews>({
    query: ReviewQuery,
    variables: {
      page: 1,
      pageSize: REVIEW_PAGE_SIZE,
    },
  })

  return {
    paths: data.QueryReviews.map(review => {
      return {
        params: {
          reviewId: review.id,
        },
      }
    }),
    fallback: "blocking",
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context

  const { data } = await client.query<QueryReviewById>({
    query: ReviewsQueryById,
    variables: {
      queryReviewByIdId: params?.reviewId,
    },
  })

  const story = data.QueryReviewById.story

  return {
    props: {
      review: data,
      story: story?.publish
        ? story
        : {
            story_title: "非公開のストーリーです",
            story_synopsis: "非公開のストーリーです",
            story_image: "",
            publish: false,
            viewing_restriction: "",
            story_categories: [],
          },
    },
    revalidate: 60,
  }
}

const ReviewPage: NextPage<StoryPageProps> = ({ review, story }) => {
  const {
    created_at,
    review_body,
    review_title,
    stars,
    story_id,
    user,
    user_id,
  } = review.QueryReviewById
  return (
    <Layout
      meta={{
        pageName: `StoryHub | ${story.story_title}へ${review.QueryReviewById?.user?.user_name}さんのレビュー。「${review_title}」`,
        description: `${review.QueryReviewById.review_body}`,
        cardImage: `${story.story_image || "/img/StoryHubLogo.png"}`,
      }}
    >
      <div className="flex flex-col justify-center items-center p-8 w-full">
        <Tab
          color="purple"
          values={[
            {
              label: "レビュー",
              children: stars && (
                <div className="flex flex-col items-center py-4">
                  <h3 className="mb-4 font-mono text-2xl font-black text-yellow-400 sm:text-4xl">
                    {reviewState[stars as Star]}
                  </h3>
                  <img
                    className="mb-4 w-[100px] h-[100px] sm:w-[200px] sm:h-[200px]"
                    src={`/img/${stars}.svg`}
                    alt=""
                  />
                  <div className="flex flex-wrap gap-1 items-center mb-8">
                    {reviewStars.map(star => {
                      return (
                        <div
                          key={star}
                          className={cc([
                            "w-12 h-12 sm:w-20 sm:h-20",
                            star <= stars ? "text-yellow-400" : "text-gray-500",
                          ])}
                        >
                          <StarIcon />
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-col justify-start w-full sm:w-[500px]">
                    <Link
                      href={{
                        pathname: "/[userId]",
                        query: {
                          userId: user_id,
                        },
                      }}
                    >
                      <a className="flex items-center p-2 mb-4 w-fit bg-purple-100 rounded-full">
                        <div className="mr-4 min-w-[2rem] sm:min-w-[2.5rem]">
                          <img
                            className="object-cover object-center w-8 h-8 rounded-full sm:w-10 sm:h-10"
                            src={user?.image || "/img/Vector.png"}
                            alt={user?.user_name || "avatar"}
                          />
                        </div>
                        <p className="font-bold sm:text-xl">
                          {user?.user_name}
                        </p>
                      </a>
                    </Link>
                    <h2 className="mb-4 text-xl font-bold text-purple-500 sm:text-2xl">
                      {review_title}
                    </h2>
                    <div className="mb-4 text-slate-600 whitespace-pre-wrap">
                      {review_body}
                    </div>
                    <p className="font-mono text-right text-slate-400">
                      {created_at && format(new Date(created_at), "yyyy/MM/dd")}
                    </p>
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
                          story.story_image ||
                          "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
                        })`,
                      }}
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-wrap gap-3 mb-4">
                        {story.story_categories?.map(category => {
                          return (
                            <span
                              key={category}
                              className="py-1 px-2 text-sm font-bold text-purple-500 bg-yellow-300 rounded-r-full rounded-bl-full"
                            >
                              {category}
                            </span>
                          )
                        })}
                      </div>
                      <Link
                        href={{
                          pathname: "/story/[storyId]",
                          query: {
                            storyId: story_id,
                          },
                        }}
                      >
                        <a className="block mb-4 text-2xl font-black">
                          {story.story_title}
                        </a>
                      </Link>

                      <p className="mb-4 text-slate-600 whitespace-pre-wrap">
                        {story.story_synopsis}
                      </p>
                      <p className="font-mono text-right text-slate-400">
                        {story.created_at &&
                          format(new Date(story.created_at), "yyyy/MM/dd")}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Layout>
  )
}

export default ReviewPage
