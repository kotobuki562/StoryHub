/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import { gql, useMutation, useQuery } from "@apollo/client"
import cc from "classcat"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
import { Switch } from "src/components/atoms/Switch"
import { TextArea } from "src/components/atoms/TextArea"
import { Layout } from "src/components/Layout"
import { LoadingLogo } from "src/components/Loading"
import type { NexusGenArgTypes } from "src/generated/nexus-typegen"
import { useStorage } from "src/hooks/storage/useStorage"
import { supabase } from "src/lib/supabase"
import type { QueryMySeasonById } from "src/types/Season/query"

const SeasonUpdate = gql`
  mutation Mutation(
    $seasonId: String!
    $storyId: String!
    $seasonTitle: String!
    $seasonSynopsis: String!
    $publish: Boolean!
    $acessToken: String!
    $userId: String!
    $seasonImage: String
  ) {
    updateSeason(
      seasonId: $seasonId
      storyId: $storyId
      seasonTitle: $seasonTitle
      seasonSynopsis: $seasonSynopsis
      publish: $publish
      acessToken: $acessToken
      userId: $userId
      seasonImage: $seasonImage
    ) {
      id
    }
  }
`

const MySeasonQuery = gql`
  query Query(
    $queryMySeasonByIdId: String!
    $userId: String!
    $accessToken: String!
  ) {
    QueryMySeasonById(
      id: $queryMySeasonByIdId
      userId: $userId
      accessToken: $accessToken
    ) {
      story_id
      season_title
      season_image
      season_synopsis
      publish
      created_at
      updated_at
      id
      story {
        id
        story_title
        story_synopsis
        story_image
      }
    }
  }
`

const CreateSeason: NextPage = () => {
  const router = useRouter()
  const { seasonId, storyId, userId } = router.query
  const { imageUrls } = useStorage(userId as string, "season")
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [isStorage, setIsStorage] = useState<boolean>(true)
  const [seasonImage, setSeasonImage] = useState<string>("")
  const accessToken = supabase.auth.session()?.access_token
  const {
    data: mySeason,
    error: mySeasonError,
    loading: isMySeasonLoading,
  } = useQuery<QueryMySeasonById>(MySeasonQuery, {
    variables: {
      queryMySeasonByIdId: seasonId as string,
      userId: userId as string,
      accessToken: accessToken ? accessToken : null,
    },
  })

  const { publish, season_image, season_synopsis, season_title, story } =
    mySeason?.QueryMySeasonById || {}

  const [
    updateSeason,
    { error: errorUpdateSeason, loading: isLoadingUpdateSeason },
  ] = useMutation<NexusGenArgTypes["Mutation"]["updateSeason"]>(SeasonUpdate)

  const handleTogglePublish = useCallback(() => {
    setIsPublish(pre => {
      return !pre
    })
  }, [])

  const handleToggleStorage = useCallback(() => {
    setIsStorage(pre => {
      return !pre
    })
  }, [])

  const handleSelectSeasonImage = useCallback(
    (url: string) => {
      setSeasonImage(url)
    },
    [setSeasonImage]
  )

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      synopsis: "",
      title: "",
      imageUrl: "",
    },
  })

  const { synopsis, title } = watch()

  useEffect(() => {
    if (season_image) {
      setSeasonImage(season_image)
    }

    if (publish) {
      setIsPublish(publish)
    }

    if (season_synopsis) {
      setValue("synopsis", season_synopsis)
    }

    if (season_title) {
      setValue("title", season_title)
    }
  }, [publish, season_image, season_synopsis, season_title, setValue])

  const handleSubmitData = useCallback(async () => {
    await updateSeason({
      variables: {
        seasonId: seasonId as string,
        storyId: storyId as string,
        publish: isPublish,
        userId: userId as string,
        seasonTitle: getValues("title"),
        seasonSynopsis: getValues("synopsis"),
        seasonImage: isStorage ? seasonImage : getValues("imageUrl"),
        acessToken: accessToken ? accessToken : null,
      },
      refetchQueries: [
        {
          query: MySeasonQuery,
          variables: {
            queryMySeasonByIdId: seasonId as string,
            userId: userId as string,
            accessToken: accessToken ? accessToken : null,
          },
        },
      ],
    }).then(() => {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title={`${mySeason?.QueryMySeasonById.season_title}のシーズンを更新しました`}
            usage="success"
          />
        )
      })
      return router.push(`/myPage/${userId}/story/${storyId}`)
    })
  }, [
    updateSeason,
    seasonId,
    storyId,
    isPublish,
    userId,
    getValues,
    isStorage,
    seasonImage,
    accessToken,
    router,
    mySeason?.QueryMySeasonById.season_title,
  ])

  useEffect(() => {
    if (errorUpdateSeason || mySeasonError) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={errorUpdateSeason?.message || mySeasonError?.message}
          />
        )
      })
    }
  }, [errorUpdateSeason, mySeasonError])

  if (isMySeasonLoading || !userId || isLoadingUpdateSeason) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  if (!isMySeasonLoading && mySeasonError && !isLoadingUpdateSeason) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Toaster position="top-center" />
      <div className="p-8">
        <div className="flex flex-col justify-center items-center py-4 w-full">
          <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
            <div
              className="overflow-hidden mb-8 w-[210px] h-[297px] bg-center bg-cover rounded-lg sm:w-[300.38px] sm:h-[425px] xl:w-[375px] xl:h-[530.57px]"
              style={{
                backgroundImage: `url(${
                  story?.story_image ||
                  "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
                })`,
              }}
            />
            <div className="flex flex-col">
              <h2 className="mb-4 text-2xl font-black">{story?.story_title}</h2>
              <p className="text-slate-600 whitespace-pre-wrap">
                {story?.story_synopsis}
              </p>
            </div>
          </div>
        </div>
        <form className="p-4" onSubmit={handleSubmit(handleSubmitData)}>
          <div className="flex flex-col mb-4 w-full">
            <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
              <p>{isPublish ? "公開する" : "公開しない"}</p>
            </label>
            <Switch
              checked={isPublish}
              onToggle={handleTogglePublish}
              size="medium"
            />
          </div>

          <div className="flex flex-col mb-4 w-full">
            <p className={cc([title?.length > 50 && "text-red-500"])}>
              {title?.length}/50
            </p>
            <Input
              label="タイトル"
              required={true}
              placeholder="シーズンのタイトルを入力してください"
              type="text"
              {...register("title", {
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

            {errors && errors.title && (
              <p className="text-xs italic text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col mb-4 w-full">
            <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
              <p>
                {isStorage ? "コンテンツから表紙を登録" : "URLから表紙を登録"}
              </p>
            </label>
            <div className="mb-4">
              <Switch
                onToggle={handleToggleStorage}
                checked={isStorage}
                size="medium"
              />
            </div>

            {imageUrls.length > 0 && isStorage ? (
              <div className="flex overflow-x-scroll gap-5 items-center mb-4 w-full">
                {imageUrls.map(url => {
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectSeasonImage(url)
                      }}
                      className={cc([
                        "min-w-[297px]",
                        seasonImage === url && "border-4 border-yellow-500",
                      ])}
                      key={url}
                    >
                      <img
                        className="w-[297px] h-[210px]"
                        src={url}
                        alt="シーズン画像"
                      />
                    </button>
                  )
                })}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <Input
                    label="URL"
                    placeholder="画像のURLを入力してください"
                    type="text"
                    {...register("imageUrl", {
                      maxLength: {
                        value: 1000,
                        message: "URLは1000文字以下です",
                      },
                    })}
                  />
                </div>
                <div>
                  <img
                    className="object-cover object-center w-[297px] h-[210px]"
                    src={getValues("imageUrl")}
                    alt="preview"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col mb-4 w-full">
            <p className={cc([synopsis?.length > 1000 && "text-red-500"])}>
              {synopsis?.length}/1000
            </p>
            <TextArea
              label="あらすじ"
              required={true}
              {...register("synopsis", {
                required: true,
                maxLength: {
                  value: 1000,
                  message: "あらすじは1000文字以下です",
                },
              })}
            />
            {errors && errors.synopsis && (
              <p className="text-xs italic text-red-500">
                {errors.synopsis.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center w-full">
            <Button
              usage="base"
              disabled={isLoadingUpdateSeason}
              isLoading={isLoadingUpdateSeason}
              type="submit"
              text="更新"
            />
          </div>
        </form>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(CreateSeason)