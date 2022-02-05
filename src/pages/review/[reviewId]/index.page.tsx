/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { StarIcon } from "@heroicons/react/solid"
import cc from "classcat"
import gql from "graphql-tag"
import type { GetStaticPropsContext, NextPage } from "next"
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
      updated_at
      user {
        user_name
        image
      }
      story {
        story_title
        story_synopsis
        story_image
        publish
        viewing_restriction
        story_categories
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
    id,
    review_body,
    review_title,
    stars,
    story_id,
    updated_at,
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
        {stars && (
          <div className="flex flex-col items-center">
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
              <h2 className="mb-4 text-xl font-bold text-purple-500 sm:text-2xl">
                {review_title}
              </h2>
              <div className="whitespace-pre-wrap">{review_body}</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ReviewPage
