/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import gql from "graphql-tag"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { MyStoryCard } from "src/components/blocks/Card"
import { Layout } from "src/components/Layout"
import { LoadingLogo } from "src/components/Loading"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import type { QueryMyStories } from "src/types/Story/query"

const MyStoriesQuery = gql`
  query QueryMyStories($userId: String!, $accessToken: String!) {
    QueryMyStories(userId: $userId, accessToken: $accessToken) {
      id
      user_id
      publish
      story_title
      story_synopsis
      story_categories
      story_image
      viewing_restriction
      created_at
      updated_at
    }
  }
`

const HomePage: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const accessToken = supabase.auth.session()?.access_token

  const {
    data,
    error: errorInfo,
    isLoading,
  } = useSwrQuery<QueryMyStories>(MyStoriesQuery, {
    userId: userId as string,
    accessToken: `${accessToken}`,
  })

  useEffect(() => {
    if (errorInfo) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={errorInfo?.message}
          />
        )
      })
    }
  }, [errorInfo])

  if (isLoading || !userId) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  if (!isLoading && errorInfo) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      meta={{
        pageName: `StoryHub | 妄想を、吐き出せ`,
        description: `StoryHubはあなたの思い描いた物語を自由に創作するプラットフォームです。あなたも今すぐ「妄想を、吐き出せ」`,
        cardImage: `/img/StoryHubLogo.png`,
      }}
    >
      <div className="p-8">
        {data?.QueryMyStories && (
          <div className="flex flex-wrap gap-8 justify-center w-full">
            {data?.QueryMyStories.length > 0 ? (
              data?.QueryMyStories.map(story => {
                return <MyStoryCard key={story.id} {...story} />
              })
            ) : (
              <div className="flex flex-col justify-center items-center w-full h-full">
                <h1 className="text-xl font-bold text-center sm:text-3xl">
                  あなたの投稿はまだありません
                </h1>
                <img
                  src="https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
                  alt="not contents"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HomePage
