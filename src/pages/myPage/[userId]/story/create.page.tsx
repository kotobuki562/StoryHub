/* eslint-disable @next/next/no-img-element */
import { gql, useMutation } from "@apollo/client"
import cc from "classcat"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { memo, useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
import { Select } from "src/components/atoms/Select"
import { Switch } from "src/components/atoms/Switch"
import { TextArea } from "src/components/atoms/TextArea"
import { BreadcrumbTrail } from "src/components/blocks/BreadcrumbTrail"
import { Menu } from "src/components/blocks/Menu"
import { Layout } from "src/components/Layout"
import { useStoryImage } from "src/hooks/storage/useStoryImage"
import { supabase } from "src/lib/supabase"
import { ageCategories, categories } from "src/tools/options"

const CreateStory = gql`
  mutation Mutation(
    $storyTitle: String!
    $storyCategories: [String!]!
    $publish: Boolean!
    $acessToken: String!
    $storySynopsis: String!
    $storyImage: String
    $viewingRestriction: String
  ) {
    createStory(
      storyTitle: $storyTitle
      storyCategories: $storyCategories
      publish: $publish
      acessToken: $acessToken
      storySynopsis: $storySynopsis
      storyImage: $storyImage
      viewingRestriction: $viewingRestriction
    ) {
      id
    }
  }
`

const CreateStoryPage: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const { storyImageUrls } = useStoryImage(userId as string)
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [isStorage, setIsStorage] = useState<boolean>(true)
  const [storyImage, setStoryImage] = useState<string>("")
  const [isHiddenAgeCategoryMenu, setIsHiddenAgeCategoryMenu] =
    useState<boolean>(true)
  const accessToken = supabase.auth.session()?.access_token
  const [
    createStory,
    { error: errorCreateStory, loading: isLoadingCreateStory },
  ] = useMutation(CreateStory)
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
  } = useForm({
    defaultValues: {
      viewingRestriction: "",
      synopsis: "",
      title: "",
      imageUrl: "",
    },
  })
  const handleSubmitData = handleSubmit(async data => {
    try {
      await createStory({
        variables: {
          storyTitle: data.title,
          storyCategories: storyCategoryes,
          publish: isPublish,
          acessToken: accessToken ? accessToken : null,
          storySynopsis: data.synopsis,
          storyImage: isStorage ? storyImage : data.imageUrl,
          viewingRestriction:
            data.viewingRestriction === "" ? null : data.viewingRestriction,
        },
      })
      toast.custom(t => {
        return <Alert t={t} title="ストーリーを作成しました" usage="success" />
      })
      return router.push(`/myPage/${userId}/story`)
    } catch (error) {
      return toast.custom(t => {
        return (
          <Alert t={t} title="ストーリーの作成に失敗しました" usage="error" />
        )
      })
    }
  })

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
              label: "ストーリー作成",
              href: router.asPath,
            },
          ]}
        />
      </div>
      <div className="p-8">
        <form onSubmit={handleSubmitData}>
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
            <div className="flex flex-wrap gap-2 mb-4 w-full text-sm xs:text-base">
              {categories.map(data => {
                return (
                  <button
                    className={cc([
                      "py-1 px-2 font-semibold rounded-full duration-200",
                      storyCategoryes.includes(data.category_title)
                        ? "text-white bg-purple-500"
                        : "bg-purple-100 text-purple-300",
                    ])}
                    key={data.category_title}
                    type="button"
                    onClick={() => {
                      return handleChangeStoryCategory(data.category_title)
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
            <div className="flex flex-wrap gap-4 w-full text-sm font-semibold xs:text-base">
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
            <Input
              label="タイトル"
              required={true}
              placeholder="50文字以内でストーリーのタイトルを入力してください"
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
                <div className="grid grid-cols-1 gap-2 p-2 w-[300px]">
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
            <TextArea
              label="あらすじ"
              placeholder="1000文字以内でストーリーのあらすじを入力してください。"
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
              text="ストーリー作成"
            />
          </div>
        </form>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(CreateStoryPage)
