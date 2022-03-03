/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import { gql, useMutation } from "@apollo/client"
import cc from "classcat"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { memo, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
import { Switch } from "src/components/atoms/Switch"
import { TextArea } from "src/components/atoms/TextArea"
import { BreadcrumbTrail } from "src/components/blocks/BreadcrumbTrail"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { LoadingLogo } from "src/components/Loading"
import { useStorage } from "src/hooks/storage/useStorage"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import type { QueryMySeasonById } from "src/types/Season/query"

const EpisodeCreate = gql`
  mutation Mutation(
    $episodeTitle: String!
    $episodeSynopsis: String!
    $publish: Boolean!
    $acessToken: String!
    $userId: String!
    $episodeImage: String
    $seasonId: String!
  ) {
    createEpisode(
      episodeTitle: $episodeTitle
      episodeSynopsis: $episodeSynopsis
      publish: $publish
      acessToken: $acessToken
      userId: $userId
      episodeImage: $episodeImage
      seasonId: $seasonId
    ) {
      id
    }
  }
`

const MySeasonQuery = gql`
  query QuerySeasonById(
    $queryMySeasonByIdId: String!
    $userId: String!
    $accessToken: String!
  ) {
    QueryMySeasonById(
      id: $queryMySeasonByIdId
      userId: $userId
      accessToken: $accessToken
    ) {
      id
      season_title
      season_image
      season_synopsis
    }
  }
`

const CreateEpisode: NextPage = () => {
  const router = useRouter()
  const { seasonId, storyId, userId } = router.query
  const { imageUrls } = useStorage(userId as string, "episode")
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [isStorage, setIsStorage] = useState<boolean>(true)
  const [seasonImage, setSeasonImage] = useState<string>("")
  const accessToken = supabase.auth.session()?.access_token

  const {
    data: season,
    error: seasonError,
    isLoading: seasonIsLoading,
  } = useSwrQuery<QueryMySeasonById>(MySeasonQuery, {
    queryMySeasonByIdId: seasonId as string,
    userId: userId as string,
    accessToken: accessToken as string,
  })

  const [
    createEpisode,
    { error: createEpisodeError, loading: createEpisodeIsLoading },
  ] = useMutation(EpisodeCreate)

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

  const handleSelectSeasonImage = useCallback((url: string) => {
    setSeasonImage(url)
  }, [])

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      synopsis: "",
      title: "",
      imageUrl: "",
    },
  })

  const handleSubmitData = handleSubmit(async data => {
    await createEpisode({
      variables: {
        episodeTitle: data.title,
        episodeSynopsis: data.synopsis,
        episodeImage: isStorage ? seasonImage : data.imageUrl,
        seasonId: seasonId as string,
        publish: isPublish,
        acessToken: accessToken ? accessToken : null,
        userId: userId as string,
      },
    }).then(() => {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title={`${season?.QueryMySeasonById?.season_title}のエピソードを作成しました`}
            usage="success"
          />
        )
      })
      return router.push(
        `/myPage/${userId}/story/${storyId}/season/${seasonId}`
      )
    })
  })

  if (createEpisodeError) {
    toast.custom(t => {
      return (
        <Alert
          t={t}
          title="エラーが発生しました"
          usage="error"
          message={createEpisodeError?.message}
        />
      )
    })
  }

  if (seasonError) {
    seasonError.response.errors.forEach(error => {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={error.message}
          />
        )
      })
    })
  }

  if (seasonIsLoading || !userId) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  if (seasonError) {
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
      <div className="flex justify-start">
        <BreadcrumbTrail
          separator=">"
          breadcrumbs={[
            {
              href: `/myPage/${userId}/story`,
              label: "ストーリー一覧",
            },
            {
              label: "ストーリー詳細",
              href: `/myPage/${userId}/story/${storyId}`,
            },
            {
              label: "シーズン詳細",
              href: `/myPage/${userId}/story/${storyId}/season/${seasonId}`,
            },
            {
              label: "エピソード作成",
              href: router.asPath,
            },
          ]}
        />
      </div>

      <div className="p-8">
        <Tab
          color="purple"
          values={[
            {
              label: "エピソード作成",
              children: (
                <form className="py-4" onSubmit={handleSubmitData}>
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
                    <Input
                      label="タイトル"
                      required={true}
                      placeholder="エピソードのタイトルを入力してください"
                      type="text"
                      error={{
                        isError: !!errors.title,
                        message: errors.title?.message as string,
                      }}
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
                        {isStorage
                          ? "コンテンツから表紙を登録"
                          : "URLから表紙を登録"}
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
                                "min-w-[210px]",
                                seasonImage === url &&
                                  "border-4 border-yellow-500",
                              ])}
                              key={url}
                            >
                              <img
                                className="w-[210px] h-[297px]"
                                src={url}
                                alt="エピソード画像"
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
                      primary
                      usage="base"
                      disabled={createEpisodeIsLoading}
                      isLoading={createEpisodeIsLoading}
                      type="submit"
                      text="作成"
                    />
                  </div>
                </form>
              ),
            },
            {
              label: "シーズン",
              children: (
                <div className="flex flex-col justify-center items-center py-4 w-full">
                  <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
                    <div
                      className="overflow-hidden mb-8 w-[210px] h-[297px] bg-center bg-cover rounded-lg sm:w-[300.38px] sm:h-[425px] xl:w-[375px] xl:h-[530.57px]"
                      style={{
                        backgroundImage: `url(${
                          season?.QueryMySeasonById?.season_image ||
                          "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
                        })`,
                      }}
                    />
                    <div className="flex flex-col">
                      <h2 className="mb-4 text-2xl font-black">
                        {season?.QueryMySeasonById?.season_title}
                      </h2>
                      <p className="text-slate-600 whitespace-pre-wrap">
                        {season?.QueryMySeasonById?.season_synopsis}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              label: "チャプター",
              children: (
                <div className="flex flex-col justify-center items-center py-4 w-full"></div>
              ),
            },
          ]}
        />
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(CreateEpisode)
