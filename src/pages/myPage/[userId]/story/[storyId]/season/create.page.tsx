/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import { gql, useMutation } from "@apollo/client"
import cc from "classcat"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect, useState } from "react"
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
import type { QueryMyStoryById } from "src/types/Story/query"

const SeasonCreate = gql`
  mutation Mutation(
    $storyId: String!
    $seasonTitle: String!
    $seasonSynopsis: String!
    $publish: Boolean!
    $acessToken: String!
    $seasonImage: String
  ) {
    createSeason(
      storyId: $storyId
      seasonTitle: $seasonTitle
      seasonSynopsis: $seasonSynopsis
      publish: $publish
      acessToken: $acessToken
      seasonImage: $seasonImage
    ) {
      id
    }
  }
`

const MyStoryQuery = gql`
  query QueryMyStoryById(
    $queryMyStoryByIdId: String!
    $userId: String!
    $accessToken: String!
  ) {
    QueryMyStoryById(
      id: $queryMyStoryByIdId
      userId: $userId
      accessToken: $accessToken
    ) {
      id
      story_title
      story_synopsis
      story_image
    }
  }
`

const CreateSeason: NextPage = () => {
  const router = useRouter()
  const { storyId, userId } = router.query
  const { imageUrls } = useStorage(userId as string, "season")
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [isStorage, setIsStorage] = useState<boolean>(true)
  const [seasonImage, setSeasonImage] = useState<string>("")
  const accessToken = supabase.auth.session()?.access_token

  const {
    data: myStoryData,
    error: myStoryError,
    isLoading: isMyStoryLoading,
  } = useSwrQuery<QueryMyStoryById>(MyStoryQuery, {
    queryMyStoryByIdId: storyId as string,
    userId: userId as string,
    accessToken: accessToken as string,
  })

  const [
    createSeason,
    { error: errorCreateSeason, loading: isLoadingCreateSeason },
  ] = useMutation<NexusGenArgTypes["Mutation"]["createSeason"]>(SeasonCreate)

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
    watch,
  } = useForm({
    defaultValues: {
      synopsis: "",
      title: "",
      imageUrl: "",
    },
  })

  const { synopsis, title } = watch()

  const handleSubmitData = useCallback(async () => {
    await createSeason({
      variables: {
        seasonTitle: getValues("title"),
        seasonSynopsis: getValues("synopsis"),
        seasonImage: isStorage ? seasonImage : getValues("imageUrl"),
        storyId: storyId as string,
        publish: isPublish,
        acessToken: accessToken ? accessToken : null,
      },
    }).then(() => {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title={`${myStoryData?.QueryMyStoryById.story_title}????????????????????????????????????`}
            usage="success"
          />
        )
      })
      return router.push(`/myPage/${userId}/story/${storyId}`)
    })
  }, [
    createSeason,
    getValues,
    isStorage,
    seasonImage,
    storyId,
    isPublish,
    accessToken,
    router,
    userId,
    myStoryData?.QueryMyStoryById.story_title,
  ])

  useEffect(() => {
    if (errorCreateSeason) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="??????????????????????????????"
            usage="error"
            message={errorCreateSeason?.message}
          />
        )
      })
    }
  }, [errorCreateSeason])

  useEffect(() => {
    if (myStoryError) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="??????????????????????????????"
            usage="error"
            message={myStoryError.response.errors
              .map(e => {
                return e.message
              })
              .join("\n")}
          />
        )
      })
    }
  }, [myStoryError])

  if (isMyStoryLoading || !userId || isLoadingCreateSeason) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  if (!isMyStoryLoading && myStoryError && !isLoadingCreateSeason) {
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
              label: "?????????????????????",
            },
            {
              label: "?????????????????????",
              href: `/myPage/${userId}/story/${storyId}`,
            },
            {
              label: "??????????????????",
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
              label: "??????????????????",
              children: (
                <form
                  className="py-4"
                  onSubmit={handleSubmit(handleSubmitData)}
                >
                  <div className="flex flex-col mb-4 w-full">
                    <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
                      <p>{isPublish ? "????????????" : "???????????????"}</p>
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
                      label="????????????"
                      required={true}
                      placeholder="??????????????????????????????????????????????????????"
                      type="text"
                      {...register("title", {
                        required: true,
                        minLength: {
                          value: 2,
                          message: "??????????????????2??????????????????",
                        },
                        maxLength: {
                          value: 50,
                          message: "??????????????????50??????????????????",
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
                          ? "????????????????????????????????????"
                          : "URL?????????????????????"}
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
                                seasonImage === url &&
                                  "border-4 border-yellow-500",
                              ])}
                              key={url}
                            >
                              <img
                                className="w-[297px] h-[210px]"
                                src={url}
                                alt="??????????????????"
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
                            placeholder="?????????URL???????????????????????????"
                            type="text"
                            {...register("imageUrl", {
                              maxLength: {
                                value: 1000,
                                message: "URL???1000??????????????????",
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
                      label="????????????"
                      required={true}
                      {...register("synopsis", {
                        required: true,
                        maxLength: {
                          value: 1000,
                          message: "???????????????1000??????????????????",
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
                      disabled={isLoadingCreateSeason}
                      isLoading={isLoadingCreateSeason}
                      type="submit"
                      text="??????"
                    />
                  </div>
                </form>
              ),
            },
            {
              label: "???????????????",
              children: (
                <div className="flex flex-col justify-center items-center py-4 w-full">
                  <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
                    <div
                      className="overflow-hidden mb-8 w-[210px] h-[297px] bg-center bg-cover rounded-lg sm:w-[300.38px] sm:h-[425px] xl:w-[375px] xl:h-[530.57px]"
                      style={{
                        backgroundImage: `url(${
                          myStoryData?.QueryMyStoryById.story_image ||
                          "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
                        })`,
                      }}
                    />
                    <div className="flex flex-col">
                      <h2 className="mb-4 text-2xl font-black">
                        {myStoryData?.QueryMyStoryById.story_title}
                      </h2>
                      <p className="text-slate-600 whitespace-pre-wrap">
                        {myStoryData?.QueryMyStoryById.story_synopsis}
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

// eslint-disable-next-line import/no-default-export
export default memo(CreateSeason)
