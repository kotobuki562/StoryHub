/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import { gql, useMutation } from "@apollo/client"
import { PlusIcon } from "@heroicons/react/solid"
import cc from "classcat"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
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
import type { NexusGenArgTypes } from "src/generated/nexus-typegen"
import { useStorage } from "src/hooks/storage/useStorage"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import type { QueryMyEpisodeById } from "src/types/Episode/query"

const EpisodeUpdate = gql`
  mutation UpdateEpisode(
    $episodeId: String!
    $episodeTitle: String!
    $episodeSynopsis: String!
    $publish: Boolean!
    $acessToken: String!
    $userId: String!
    $episodeImage: String
  ) {
    updateEpisode(
      episodeId: $episodeId
      episodeTitle: $episodeTitle
      episodeSynopsis: $episodeSynopsis
      publish: $publish
      acessToken: $acessToken
      userId: $userId
      episodeImage: $episodeImage
    ) {
      id
    }
  }
`

const MyEpisodeQuery = gql`
  query QueryMyEpisodeById(
    $queryMyEpisodeByIdId: String!
    $userId: String!
    $accessToken: String!
    $chapterAccessToken: String
    $chapterUserId: String
  ) {
    QueryMyEpisodeById(
      id: $queryMyEpisodeByIdId
      userId: $userId
      accessToken: $accessToken
    ) {
      id
      episode_image
      episode_synopsis
      episode_title
      publish
      chapters(
        chapterAccessToken: $chapterAccessToken
        chapterUserId: $chapterUserId
      ) {
        id
        chapter_title
        chapter_image
        publish
      }
    }
  }
`

const CreateSeason: NextPage = () => {
  const router = useRouter()
  const { episodeId, seasonId, storyId, userId } = router.query
  const { imageUrls } = useStorage(userId as string, "episode")
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [isStorage, setIsStorage] = useState<boolean>(true)
  const [episodeImage, setEpisodeImage] = useState<string>("")
  const accessToken = supabase.auth.session()?.access_token

  const {
    data: myEpisode,
    error: mySeasonError,
    isLoading: isMySeasonLoading,
  } = useSwrQuery<QueryMyEpisodeById>(MyEpisodeQuery, {
    queryMyEpisodeByIdId: episodeId as string,
    userId: userId as string,
    accessToken: accessToken as string,
    chapterAccessToken: accessToken as string,
    chapterUserId: userId as string,
  })

  const {
    chapters: myChapters,
    episode_image,
    episode_synopsis,
    episode_title,
    publish,
  } = myEpisode?.QueryMyEpisodeById || {}

  const chapters = useMemo(() => {
    return myChapters ? myChapters : []
  }, [myChapters])

  const [
    updateEpisode,
    { error: errorUpdateSeason, loading: isLoadingUpdateSeason },
  ] = useMutation<NexusGenArgTypes["Mutation"]["updateEpisode"]>(EpisodeUpdate)

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

  const handleSelectEpisodeImage = useCallback(
    (url: string) => {
      setEpisodeImage(url)
    },
    [setEpisodeImage]
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
    if (episode_image) {
      setEpisodeImage(episode_image)
    }

    if (publish) {
      setIsPublish(publish)
    }

    if (episode_synopsis) {
      setValue("synopsis", episode_synopsis)
    }

    if (episode_title) {
      setValue("title", episode_title)
    }
  }, [episode_image, episode_synopsis, episode_title, publish, setValue])

  const handleSubmitData = handleSubmit(async data => {
    await updateEpisode({
      variables: {
        episodeId: episodeId as string,
        episodeTitle: data.title,
        episodeSynopsis: data.synopsis,
        publish: isPublish,
        acessToken: accessToken ? accessToken : null,
        userId: userId as string,
        episodeImage: isStorage ? episodeImage : data.imageUrl,
      },
      refetchQueries: [
        {
          query: MyEpisodeQuery,
          variables: {
            queryMyEpisodeByIdId: episodeId as string,
            userId: userId as string,
            accessToken: accessToken as string,
            chapterAccessToken: accessToken as string,
            chapterUserId: userId as string,
          },
        },
      ],
    }).then(() => {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title={`${episode_title}を更新しました`}
            usage="success"
          />
        )
      })
      return router.push(
        `/myPage/${userId}/story/${storyId}/season/${seasonId}/episode/${episodeId}`
      )
    })
  })

  useEffect(() => {
    if (errorUpdateSeason) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={errorUpdateSeason?.message}
          />
        )
      })
    }
  }, [errorUpdateSeason])

  useEffect(() => {
    if (mySeasonError) {
      mySeasonError.response.errors.map(error => {
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
  }, [mySeasonError])

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
              label: "ストーリーの詳細",
              href: router.asPath,
            },
          ]}
        />
      </div>
      <div className="p-8">
        <h2 className="mb-8 text-xl font-bold text-center text-purple-500 sm:text-4xl">
          {episode_title}の詳細
        </h2>
        <Tab
          color="purple"
          values={[
            {
              label: "編集する",
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
                                handleSelectEpisodeImage(url)
                              }}
                              className={cc([
                                "min-w-[210px]",
                                episodeImage === url &&
                                  "border-4 border-yellow-500",
                              ])}
                              key={url}
                            >
                              <img
                                className="w-[210px] h-[297px]"
                                src={url}
                                alt="エピソードの画像"
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
                    <p
                      className={cc([
                        synopsis?.length > 1000 && "text-red-500",
                      ])}
                    >
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
                      primary
                      usage="base"
                      disabled={isLoadingUpdateSeason}
                      isLoading={isLoadingUpdateSeason}
                      type="submit"
                      text="更新"
                    />
                  </div>
                </form>
              ),
            },
            {
              label: `${chapters?.length}個のチャプター`,
              children: (
                <div className="flex flex-col justify-center items-center py-4 w-full">
                  <Link
                    href={{
                      pathname: `/myPage/${userId}/story/${storyId}/season/${seasonId}/episode/create`,
                    }}
                  >
                    <a className="flex items-center py-2 px-4 mb-4 text-lg font-bold text-purple-500 bg-yellow-100 hover:bg-yellow-300 rounded duration-200">
                      <PlusIcon className="mr-2 w-6 h-6" />
                      チャプターの作成へ
                    </a>
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(CreateSeason)
