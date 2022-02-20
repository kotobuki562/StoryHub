/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import { gql, useMutation } from "@apollo/client"
import { PlusIcon } from "@heroicons/react/solid"
import cc from "classcat"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
import { Select } from "src/components/atoms/Select"
import { Switch } from "src/components/atoms/Switch"
import { TextArea } from "src/components/atoms/TextArea"
import { BreadcrumbTrail } from "src/components/blocks/BreadcrumbTrail"
import { ReviewCard } from "src/components/blocks/Card"
import { MySeasonCard } from "src/components/blocks/Card/MySeason"
import { Menu } from "src/components/blocks/Menu"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { LoadingLogo } from "src/components/Loading"
import type { NexusGenArgTypes } from "src/generated/nexus-typegen"
import { useStoryImage } from "src/hooks/storage/useStoryImage"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import { ageCategories, categories } from "src/tools/options"
import type { QueryReviewsByStoryId } from "src/types/Review/query"
import type { QueryMyStoryById } from "src/types/Story/query"

const UpdateStory = gql`
  mutation Mutation(
    $storyId: String!
    $storyTitle: String!
    $storySynopsis: String!
    $storyCategories: [String!]!
    $publish: Boolean!
    $acessToken: String!
    $userId: String!
    $storyImage: String
    $viewingRestriction: String
  ) {
    updateStory(
      storyId: $storyId
      storyTitle: $storyTitle
      storySynopsis: $storySynopsis
      storyCategories: $storyCategories
      publish: $publish
      acessToken: $acessToken
      userId: $userId
      storyImage: $storyImage
      viewingRestriction: $viewingRestriction
    ) {
      id
    }
  }
`

const MyStoryQuery = gql`
  query QueryMyStoryById(
    $userId: String!
    $accessToken: String!
    $queryMyStoryByIdId: String!
    $seasonAccessToken: String
    $seasonUserId: String
  ) {
    QueryMyStoryById(
      userId: $userId
      accessToken: $accessToken
      id: $queryMyStoryByIdId
    ) {
      id
      user_id
      story_title
      story_categories
      story_synopsis
      story_image
      publish
      viewing_restriction
      created_at
      updated_at
      seasons(
        seasonAccessToken: $seasonAccessToken
        seasonUserId: $seasonUserId
      ) {
        id
        season_title
        season_image
        publish
        created_at
      }
    }
  }
`

const ReviewsQueryByStoryId = gql`
  query QueryReviewsByStoryId($storyId: String!, $page: Int, $pageSize: Int) {
    QueryReviewsByStoryId(storyId: $storyId, page: $page, pageSize: $pageSize) {
      id
      user_id
      review_title
      review_body
      stars
      created_at
      user {
        id
        user_name
        image
      }
    }
  }
`

const EditStoryPage: NextPage = () => {
  const router = useRouter()
  const { storyId, userId } = router.query
  const { storyImageUrls } = useStoryImage(userId as string)
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [isStorage, setIsStorage] = useState<boolean>(true)
  const [storyImage, setStoryImage] = useState<string>("")
  const [isHiddenAgeCategoryMenu, setIsHiddenAgeCategoryMenu] =
    useState<boolean>(true)
  const accessToken = supabase.auth.session()?.access_token

  const {
    data: myStoryData,
    error: myStoryError,
    isLoading: isMyStoryLoading,
    mutate,
  } = useSwrQuery<QueryMyStoryById>(MyStoryQuery, {
    userId: userId as string,
    accessToken: accessToken as string,
    queryMyStoryByIdId: storyId as string,
    seasonAccessToken: accessToken as string,
    seasonUserId: userId as string,
  })

  const { data: reviews } = useSwrQuery<QueryReviewsByStoryId>(
    ReviewsQueryByStoryId,
    {
      storyId: storyId as string,
    }
  )

  const [
    updateStory,
    { error: errorCreateStory, loading: isLoadingCreateStory },
  ] = useMutation<NexusGenArgTypes["Mutation"]["updateStory"]>(UpdateStory)
  const [storyCategoryes, setStoryCategoryes] = useState<string[]>([])

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

  const handleToggleAgeCategoryMenu = useCallback(() => {
    setIsHiddenAgeCategoryMenu(pre => {
      return !pre
    })
  }, [])

  const handleHiddenAgeCategoryMenu = useCallback(() => {
    setIsHiddenAgeCategoryMenu(true)
  }, [])

  const handleSelectStoryImage = useCallback(
    (url: string) => {
      setStoryImage(url)
    },
    [setStoryImage]
  )

  const handleChangeStoryCategory = useCallback(
    (category: string) => {
      if (storyCategoryes.includes(category)) {
        setStoryCategoryes(pre => {
          return pre.filter(c => {
            return c !== category
          })
        })
      } else {
        setStoryCategoryes(pre => {
          if (pre.length > 2) {
            toast.custom(t => {
              return (
                <Alert
                  t={t}
                  title="カテゴリーが多すぎます"
                  usage="warning"
                  message="カテゴリは最大3つまでです"
                />
              )
            })
            return pre
          }
          return [...pre, category]
        })
      }
    },
    [storyCategoryes]
  )

  const {
    formState: { errors },
    // eslint-disable-next-line sort-destructure-keys/sort-destructure-keys
    control,
    getValues,
    handleSubmit,
    register,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      viewingRestriction: "",
      synopsis: "",
      title: "",
      imageUrl: "",
    },
  })

  const { synopsis, title } = watch()

  const handleSubmitData = useCallback(async () => {
    await updateStory({
      variables: {
        userId: userId as string,
        storyId: storyId as string,
        storyTitle: getValues("title"),
        storyCategories: storyCategoryes,
        publish: isPublish,
        acessToken: accessToken ? accessToken : null,
        storySynopsis: getValues("synopsis"),
        storyImage: isStorage ? storyImage : getValues("imageUrl"),
        viewingRestriction:
          getValues("viewingRestriction") === ""
            ? null
            : getValues("viewingRestriction"),
      },
    }).then(() => {
      toast.custom(t => {
        return <Alert t={t} title="ストーリーを更新しました" usage="success" />
      })
      mutate()
      return router.push(`/myPage/${userId}/story`)
    })
  }, [
    updateStory,
    userId,
    storyId,
    getValues,
    storyCategoryes,
    isPublish,
    accessToken,
    isStorage,
    storyImage,
    mutate,
    router,
  ])

  useEffect(() => {
    if (errorCreateStory) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={errorCreateStory?.message}
          />
        )
      })
    }
  }, [errorCreateStory])

  useEffect(() => {
    if (myStoryError) {
      myStoryError.response.errors.forEach((e, i) => {
        return toast.custom(t => {
          return (
            <Alert
              key={i}
              t={t}
              title="エラーが発生しました"
              usage="error"
              message={e.message}
            />
          )
        })
      })
    }
  }, [myStoryError])

  useEffect(() => {
    if (myStoryData?.QueryMyStoryById) {
      const {
        publish,
        story_categories,
        story_image,
        story_synopsis,
        story_title,
        viewing_restriction,
      } = myStoryData.QueryMyStoryById
      setValue("title", story_title as string)
      setValue("synopsis", story_synopsis as string)
      setValue("viewingRestriction", viewing_restriction as string)
      setValue("imageUrl", story_image as string)
      setIsPublish(publish ? true : false)
      setStoryImage(story_image as string)
      setStoryCategoryes(story_categories as string[])
    }
  }, [myStoryData, setValue])

  if (isMyStoryLoading || !userId) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  if (myStoryError) {
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
              href: router.asPath,
            },
          ]}
        />
      </div>
      <div className="p-8">
        <h2 className="mb-8 text-xl font-bold text-center text-purple-500 sm:text-4xl">
          {myStoryData?.QueryMyStoryById.story_title}の詳細
        </h2>
        <Tab
          color="purple"
          values={[
            {
              label: "編集する",
              children: (
                <form
                  className="py-4 text-sm sm:text-base"
                  onSubmit={handleSubmit(handleSubmitData)}
                >
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
                    <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
                      <p>カテゴリー</p>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4 w-full">
                      {categories.map(data => {
                        return (
                          <button
                            className={cc([
                              "py-1 px-2 rounded-full duration-200",
                              storyCategoryes.includes(data.category_title)
                                ? "text-white bg-purple-500"
                                : "bg-purple-100 text-purple-300",
                            ])}
                            key={data.category_title}
                            type="button"
                            onClick={() => {
                              return handleChangeStoryCategory(
                                data.category_title
                              )
                            }}
                          >
                            {data.category_title}
                          </button>
                        )
                      })}
                    </div>
                    <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
                      <p>選択中</p>
                    </label>
                    <div className="flex flex-wrap gap-4 w-full">
                      {storyCategoryes.map(category => {
                        return (
                          <div
                            className="py-2 px-4 text-yellow-300 bg-purple-500 rounded-full"
                            key={category}
                          >
                            {category}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col mb-4 w-full">
                    <p className={cc([title?.length > 50 && "text-red-500"])}>
                      {title?.length}/50
                    </p>
                    <Input
                      label="タイトル"
                      required={true}
                      placeholder="ストーリーのタイトルを入力してください"
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

                    {storyImageUrls.length > 0 && isStorage ? (
                      <div className="flex overflow-x-scroll gap-5 items-center mb-4 w-full">
                        {storyImageUrls.map(url => {
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectStoryImage(url)
                              }}
                              className={cc([
                                "min-w-[210px]",
                                storyImage === url &&
                                  "border-4 border-yellow-500",
                              ])}
                              key={url}
                            >
                              <img
                                className="w-[210px] h-[297px]"
                                src={url}
                                alt="ストーリー画像"
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
                              required: true,
                              maxLength: {
                                value: 1000,
                                message: "URLは1000文字以下です",
                              },
                            })}
                          />
                        </div>
                        <div>
                          <img
                            className="object-cover object-center w-[210px] h-[297px]"
                            src={getValues("imageUrl")}
                            alt="preview"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col mb-4 w-full">
                    <label
                      htmlFor="title"
                      className="flex justify-end items-center mb-1 text-sm font-bold text-left text-slate-500"
                    >
                      <Menu
                        position={-90}
                        onToggle={handleToggleAgeCategoryMenu}
                        isHidden={isHiddenAgeCategoryMenu}
                        onClose={handleHiddenAgeCategoryMenu}
                        viewer={<p className="text-purple-500">年齢制限詳細</p>}
                      >
                        <div className="grid grid-cols-1 gap-2 w-[300px]">
                          {ageCategories.map(category => {
                            return (
                              <div
                                key={category.nameJa}
                                className="flex text-sm font-bold text-left text-slate-500"
                              >
                                <p className="min-w-[70px] text-purple-500">
                                  {category.nameJa}...
                                </p>
                                <p>{category.description}</p>
                              </div>
                            )
                          })}
                        </div>
                      </Menu>
                    </label>
                    <Controller
                      name="viewingRestriction"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Select
                            onChange={onChange}
                            label="年齢制限"
                            value={value}
                            options={[
                              {
                                value: "",
                                label: "---",
                              },
                              ...ageCategories.map(category => {
                                return {
                                  value: category.nameJa,
                                  label: category.nameJa,
                                }
                              }),
                            ]}
                          />
                        )
                      }}
                    />
                    {errors && errors.viewingRestriction && (
                      <p className="text-xs italic text-red-500">
                        {errors.viewingRestriction.message}
                      </p>
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
                      disabled={isLoadingCreateStory}
                      isLoading={isLoadingCreateStory}
                      type="submit"
                      text="更新"
                    />
                  </div>
                </form>
              ),
            },
            {
              label: `${myStoryData?.QueryMyStoryById.seasons?.length}個のシーズン`,
              children: (
                <div className="flex flex-col items-center py-4 w-full">
                  <Link
                    href={{
                      pathname: `/myPage/${userId}/story/${storyId}/season/create`,
                    }}
                  >
                    <a className="flex items-center py-2 px-4 mb-4 text-lg font-bold text-purple-500 bg-yellow-100 hover:bg-yellow-300 rounded duration-200">
                      <PlusIcon className="mr-2 w-6 h-6" />
                      シーズンの作成へ
                    </a>
                  </Link>
                  {myStoryData?.QueryMyStoryById.seasons &&
                  myStoryData?.QueryMyStoryById.seasons.length > 0 ? (
                    <div className="flex flex-wrap gap-5 justify-center items-center w-full">
                      {myStoryData?.QueryMyStoryById.seasons?.map(
                        (season, index) => {
                          return (
                            <MySeasonCard
                              characters={null}
                              created_at={undefined}
                              episodes={null}
                              id={null}
                              objects={null}
                              publish={null}
                              season_image={null}
                              season_synopsis={null}
                              season_title={null}
                              story={null}
                              story_id={null}
                              terminologies={null}
                              updated_at={undefined}
                              key={season?.id}
                              {...season}
                              seasonNumber={index + 1}
                              href={`/myPage/${userId}/story/${storyId}/season/${season?.id}`}
                            />
                          )
                        }
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-bold text-purple-500">
                        シーズンが存在しません
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
            {
              label: `${
                reviews?.QueryReviewsByStoryId?.length || 0
              }件のレビュー`,
              children: (
                <div className="flex flex-col items-center py-4 w-full">
                  {reviews && reviews.QueryReviewsByStoryId.length > 0 ? (
                    <div className="justify-center items-center w-full">
                      <div
                        className={cc([
                          "grid gap-1 justify-center items-center w-full bg-purple-100",
                          // reviews.lengthが3の倍数だったら, grid-cols-3にする
                          reviews.QueryReviewsByStoryId.length % 3 === 0
                            ? "grid-cols-1 lg:grid-cols-3"
                            : "grid-cols-1",
                          // reviews.lengthが2の倍数だったら, grid-cols-2にする
                          reviews.QueryReviewsByStoryId.length % 2 === 0
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-1",
                        ])}
                      >
                        {reviews.QueryReviewsByStoryId?.map(review => {
                          return <ReviewCard key={review?.id} {...review} />
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

// eslint-disable-next-line import/no-default-export
export default memo(EditStoryPage)
