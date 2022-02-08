/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import gql from "graphql-tag"
import type { NextPage } from "next"
import { ReviewCardOrigin } from "src/components/blocks/Card"
import { Pagination } from "src/components/blocks/Pagination"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import { REVIEW_PAGE_SIZE } from "src/tools/page"
import type { QueryReviews, QueryReviewsCount } from "src/types/Review/query"

const ReviewsQuery = gql`
  query QueryReviews($page: Int, $pageSize: Int) {
    QueryReviews(page: $page, pageSize: $pageSize) {
      id
      user_id
      story_id
      review_title
      review_body
      created_at
      stars
      updated_at
      user {
        user_name
        image
      }
    }
  }
`

const ReviewsCount = gql`
  query Query {
    QueryReviewsCount
  }
`
type HomePageProps = {
  reviews: QueryReviews
  reviewsCount: number
}

export const getStaticProps = async () => {
  const data = await client.query<QueryReviews>({
    query: ReviewsQuery,
    variables: {
      page: 1,
      pageSize: REVIEW_PAGE_SIZE,
    },
  })
  const totalCount = await client.query<QueryReviewsCount>({
    query: ReviewsCount,
  })

  return {
    props: {
      reviews: data.data,
      reviewsCount: totalCount.data.QueryReviewsCount,
    },
    revalidate: 60,
  }
}

const HomePage: NextPage<HomePageProps> = ({ reviews, reviewsCount }) => {
  return (
    <Layout
      meta={{
        pageName: `StoryHub | ストーリーのレビューをまとめたページです`,
        description: `ストーリーのレビューをまとめたページです。`,
        cardImage: `/img/StoryHubLogo.png`,
      }}
    >
      <div className="p-8 bg-purple-50">
        <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
          {reviews.QueryReviews && reviews.QueryReviews.length > 0 ? (
            <div className="justify-center items-center w-full">
              <div className="flex flex-wrap gap-8 justify-center w-full">
                {reviews.QueryReviews?.map(review => {
                  return <ReviewCardOrigin key={review?.id} {...review} />
                })}
              </div>
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
        <Pagination
          totalCount={reviewsCount}
          usecase="review"
          page={REVIEW_PAGE_SIZE}
        />
      </div>
    </Layout>
  )
}

export default HomePage
