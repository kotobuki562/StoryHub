/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import { gql, useMutation, useQuery } from "@apollo/client"
import cc from "classcat"
import type { NextPage } from "next"
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
import { Menu } from "src/components/blocks/Menu"
import { Layout } from "src/components/Layout"
import { LoadingLogo } from "src/components/Loading"
import type { NexusGenArgTypes } from "src/generated/nexus-typegen"
import { useStoryImage } from "src/hooks/storage/useStoryImage"
import { supabase } from "src/lib/supabase"
import { ageCategories, categories } from "src/tools/options"
import type { QueryMyStoryById } from "src/types/Story/query"

const UpdateStory = gql`
  mutation Mutation(
    $storyId: String!
    $storyTitle: String!
    $storyCategories: [String!]!
    $publish: Boolean!
    $storyImage: String
    $viewingRestriction: String
    $storySynopsis: String
    $acessToken: String!
    $userId: String!
  ) {
    updateStory(
      storyId: $storyId
      storyTitle: $storyTitle
      storyCategories: $storyCategories
      publish: $publish
      storyImage: $storyImage
      viewingRestriction: $viewingRestriction
      storySynopsis: $storySynopsis
      acessToken: $acessToken
      userId: $userId
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
      user_id
      story_title
      story_synopsis
      story_categories
      story_image
      publish
      viewing_restriction
      created_at
      updated_at
    }
  }
`

const EditStoryPage: NextPage = () => {
  const router = useRouter()
  const { storyId, userId } = router.query
  const { storyImageUrls } = useStoryImage(userId as string)
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [storyImage, setStoryImage] = useState<string>("")
  const [isHiddenAgeCategoryMenu, setIsHiddenAgeCategoryMenu] =
    useState<boolean>(true)
  const accessToken = supabase.auth.session()?.access_token
  const {
    data: myStoryData,
    error: myStoryError,
    loading: isMyStoryLoading,
  } = useQuery<QueryMyStoryById>(MyStoryQuery, {
    variables: {
      queryMyStoryByIdId: storyId as string,
      userId: userId as string,
      accessToken: `${accessToken}`,
    },
  })

  const [
    updateStory,
    { error: errorCreateStory, loading: isLoadingCreateStory },
  ] = useMutation<NexusGenArgTypes["Mutation"]["updateStory"]>(UpdateStory)
  const [storyCategoryes, setStoryCategoryes] = useState<string[]>([])

  const handleTogglePublish = useCallback(() => {
    setIsPublish(pre => !pre)
  }, [])

  const handleToggleAgeCategoryMenu = useCallback(() => {
    setIsHiddenAgeCategoryMenu(pre => !pre)
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
        setStoryCategoryes(pre => pre.filter(c => c !== category))
      } else {
        setStoryCategoryes(pre => {
          if (pre.length > 2) {
            toast.custom(t => (
              <Alert
                t={t}
                title="カテゴリーが多すぎます"
                usage="warning"
                message="カテゴリは最大3つまでです"
              />
            ))
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
        storyImage: storyImage ? storyImage : null,
        viewingRestriction:
          getValues("viewingRestriction") === ""
            ? null
            : getValues("viewingRestriction"),
      },
    }).then(() => {
      toast.custom(t => (
        <Alert t={t} title="ストーリーを作成しました" usage="success" />
      ))
      return router.push(`/myPage/${userId}/story`)
    })
  }, [
    accessToken,
    updateStory,
    getValues,
    isPublish,
    router,
    storyCategoryes,
    storyId,
    storyImage,
    userId,
  ])

  useEffect(() => {
    if (errorCreateStory || myStoryError) {
      toast.custom(t => (
        <Alert
          t={t}
          title="エラーが発生しました"
          usage="error"
          message={errorCreateStory?.message || myStoryError?.message}
        />
      ))
    }
  }, [errorCreateStory, myStoryError])

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

  if (!isMyStoryLoading && myStoryError) {
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
        <form className="p-4" onSubmit={handleSubmit(handleSubmitData)}>
          <div className="flex flex-col mb-4 w-full">
            <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
              <p>公開する</p>
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
              {categories.map(data => (
                <button
                  className={cc([
                    "py-1 px-2 rounded-full duration-200",
                    storyCategoryes.includes(data.category_title)
                      ? "text-white bg-purple-500"
                      : "bg-purple-100 text-purple-300",
                  ])}
                  key={data.category_title}
                  type="button"
                  onClick={() => handleChangeStoryCategory(data.category_title)}
                >
                  {data.category_title}
                </button>
              ))}
            </div>
            <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
              <p>選択中</p>
            </label>
            <div className="flex flex-wrap gap-4 w-full">
              {storyCategoryes.map(category => (
                <div
                  className="py-2 px-4 text-yellow-300 bg-purple-500 rounded-full"
                  key={category}
                >
                  {category}
                </div>
              ))}
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

          {storyImageUrls.length > 0 && (
            <div className="flex flex-col mb-4 w-full">
              <label className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500">
                <p>表紙</p>
              </label>
              <div className="flex overflow-x-scroll gap-5 items-center mb-4 w-full">
                {storyImageUrls.map(url => (
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStoryImage(url)
                    }}
                    className={cc([
                      "min-w-[210px]",
                      storyImage === url && "border-4 border-yellow-500",
                    ])}
                    key={url}
                  >
                    <img
                      className="w-[210px] h-[297px]"
                      src={url}
                      alt="ストーリー画像"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

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
                  {ageCategories.map(category => (
                    <div
                      key={category.nameJa}
                      className="flex text-sm font-bold text-left text-slate-500"
                    >
                      <p className="min-w-[70px] text-purple-500">
                        {category.nameJa}...
                      </p>
                      <p>{category.description}</p>
                    </div>
                  ))}
                </div>
              </Menu>
            </label>
            <Controller
              name="viewingRestriction"
              control={control}
              render={({ field: { onChange, value } }) => (
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
              )}
            />
            {errors && errors.viewingRestriction && (
              <p className="text-xs italic text-red-500">
                {errors.viewingRestriction.message}
              </p>
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
              disabled={isLoadingCreateStory}
              isLoading={isLoadingCreateStory}
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
export default memo(EditStoryPage)