/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import gql from "graphql-tag"
import type { NextPage } from "next"
// import dynamic from "next/dynamic"
import { ReviewCardOrigin, StoryCard } from "src/components/blocks/Card"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { client } from "src/lib/apollo"
import { REVIEW_PAGE_SIZE, STORY_PAGE_SIZE } from "src/tools/page"
import type { QueryReviews } from "src/types/Review/query"
import type { QueryStories } from "src/types/Story/query"

// const Spline = dynamic(
//   () => {
//     return import("@splinetool/react-spline")
//   },
//   {
//     ssr: false,
//   }
// )

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

const ReviewQuery = gql`
  query QueryReviews($page: Int, $pageSize: Int) {
    QueryReviews(page: $page, pageSize: $pageSize) {
      id
      story_id
      review_title
      stars
      user {
        id
        user_name
        image
      }
    }
  }
`

type HomePageProps = {
  stories: QueryStories
  reviews: QueryReviews
}

export const getStaticProps = async () => {
  const data = await client.query<QueryStories>({
    query: StoriesQuery,
    variables: {
      page: 1,
      pageSize: STORY_PAGE_SIZE,
    },
  })

  const reviews = await client.query<QueryReviews>({
    query: ReviewQuery,
    variables: {
      page: 1,
      pageSize: REVIEW_PAGE_SIZE,
    },
  })

  return {
    props: {
      stories: data.data,
      reviews: reviews.data,
    },
    revalidate: 60,
  }
}

const HomePage: NextPage<HomePageProps> = ({ reviews, stories }) => {
  return (
    <Layout
      meta={{
        pageName: `StoryHub | 妄想を、吐き出せ`,
        description: `StoryHubはあなたの思い描いた物語を自由に創作するプラットフォームです。あなたも今すぐ「妄想を、吐き出せ」`,
        cardImage: `/img/StoryHubLogo.png`,
      }}
    >
      {/* <div className="max-w-[500px]">
        <Spline scene="https://draft.spline.design/itQVMj9olMbtVoyc/scene.spline" />
      </div> */}

      <div className="p-8 min-h-screen bg-purple-50">
        <Tab
          color="purple"
          values={[
            {
              label: `${stories.QueryStories.length}件の新着ストーリー`,
              children: (
                <div className="flex flex-wrap gap-8 justify-center py-4 w-full">
                  {stories.QueryStories.map(story => {
                    return <StoryCard key={story.id} {...story} />
                  })}
                </div>
              ),
            },
            {
              label: `${reviews.QueryReviews.length}件の新着レビュー`,
              children: (
                <div className="flex flex-col items-center py-4 w-full">
                  {reviews.QueryReviews && reviews.QueryReviews.length > 0 ? (
                    <div className="justify-center items-center w-full">
                      <div className="flex flex-wrap gap-8 justify-center w-full">
                        {reviews.QueryReviews?.map(review => {
                          return (
                            <ReviewCardOrigin key={review?.id} {...review} />
                          )
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
              ),
            },
          ]}
        />
      </div>
    </Layout>
  )
}

export default HomePage
