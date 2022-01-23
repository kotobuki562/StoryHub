/* eslint-disable @next/next/no-img-element */
import { gql, useMutation } from "@apollo/client"
import { StarIcon } from "@heroicons/react/solid"
import cc from "classcat"
import { useRouter } from "next/router"
import type { VFC } from "react"
import { memo, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
import { TextArea } from "src/components/atoms/TextArea"
import type { NexusGenArgTypes } from "src/generated/nexus-typegen"
import { supabase } from "src/lib/supabase"

const CreateReview = gql`
  mutation Mutation(
    $storyId: String!
    $reviewTitle: String!
    $reviewBody: String!
    $stars: Int!
    $acessToken: String!
  ) {
    createReview(
      storyId: $storyId
      reviewTitle: $reviewTitle
      reviewBody: $reviewBody
      stars: $stars
      acessToken: $acessToken
    ) {
      id
    }
  }
`

const reviewStars = [1, 2, 3, 4, 5]

type FormProps = {
  userId: string
}

const CreateReviewFormComp: VFC<FormProps> = ({ userId }) => {
  const router = useRouter()
  const { storyId } = router.query
  const accessToken = supabase.auth.session()?.access_token
  const [createStory, { error: errorCreateReview, loading: isLoading }] =
    useMutation<NexusGenArgTypes["Mutation"]["createReview"]>(CreateReview)
  const [stars, setStars] = useState<number>(1)

  const handleChangeStars = useCallback((star: number) => {
    setStars(star)
  }, [])

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    watch,
  } = useForm()

  const { reviewBody, reviewTitle } = watch()

  const handleSubmitData = useCallback(async () => {
    await createStory({
      variables: {
        storyId: storyId as string,
        reviewTitle: getValues("reviewTitle"),
        reviewBody: getValues("reviewBody"),
        stars: stars,
        acessToken: accessToken,
      },
    }).then(() => {
      toast.custom(t => (
        <Alert t={t} title="ストーリーを作成しました" usage="success" />
      ))
      return router.push(`/myPage/${userId}/review`)
    })
  }, [accessToken, createStory, getValues, router, stars, storyId, userId])

  useEffect(() => {
    if (errorCreateReview) {
      toast.custom(t => (
        <Alert
          t={t}
          title="エラーが発生しました"
          usage="error"
          message={errorCreateReview?.message}
        />
      ))
    }
  }, [errorCreateReview])

  return (
    <div className="w-full">
      <Toaster position="top-center" />

      <form className="p-4" onSubmit={handleSubmit(handleSubmitData)}>
        <div className="flex flex-col justify-center items-center mb-4 w-full">
          <div className="flex gap-2 items-center">
            {reviewStars.map(star => (
              <button key={star} type="button">
                <StarIcon
                  className={cc([
                    "w-10 h-10",
                    {
                      "text-gray-500": star > stars,
                      "text-yellow-400": star <= stars,
                    },
                  ])}
                  onClick={() => handleChangeStars(star)}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col mb-4 w-full">
          <p className={cc([reviewTitle?.length > 50 && "text-red-500"])}>
            {reviewTitle?.length}/50
          </p>
          <Input
            label="タイトル"
            required={true}
            placeholder="レビューのタイトルを入力してください"
            type="text"
            {...register("reviewTitle", {
              required: true,
              minLength: {
                value: 2,
                message: "タイトル名は2文字以上です",
              },
              maxLength: {
                value: 50,
                message: "タイトル名は50文字以下です",
              },
            })}
          />

          {errors && errors.reviewTitle && (
            <p className="text-xs italic text-red-500">
              {errors.reviewTitle.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mb-4 w-full">
          <p className={cc([reviewBody?.length > 1000 && "text-red-500"])}>
            {reviewBody?.length}/1000
          </p>
          <TextArea
            label="感想"
            required={true}
            {...register("reviewBody", {
              required: true,
              maxLength: {
                value: 1000,
                message: "感想は1000文字以下です",
              },
            })}
          />
          {errors && errors.reviewBody && (
            <p className="text-xs italic text-red-500">
              {errors.reviewBody.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center w-full">
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            type="submit"
            text="レビュー作成"
          />
        </div>
      </form>
    </div>
  )
}

// eslint-disable-next-line import/no-default-export
export const CreateReviewForm = memo(CreateReviewFormComp)