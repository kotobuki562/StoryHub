/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import "react-image-crop/dist/ReactCrop.css"

import { useMutation, useQuery } from "@apollo/client"
import { PencilAltIcon } from "@heroicons/react/solid"
import { gql } from "graphql-tag"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Modal } from "src/components/blocks/Modal"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { LoadingLogo } from "src/components/Loading"
import type { NexusGenArgTypes } from "src/generated/nexus-typegen"
import { supabase } from "src/lib/supabase"
import { isMe } from "src/tools/state"
import type { QueryUserById } from "src/types/User/query"

const UpdateUserMutation = gql`
  mutation Mutation(
    $userName: String!
    $userDeal: String!
    $accessToken: String!
    $image: String
  ) {
    updateUser(
      userName: $userName
      userDeal: $userDeal
      accessToken: $accessToken
      image: $image
    ) {
      id
      user_name
      user_deal
      image
      created_at
    }
  }
`
const UserQueryById = gql`
  query QueryUserById(
    $queryUserByIdId: String!
    $storyPage: Int!
    $storyPageSize: Int!
    $storyAccessToken: String
    $reviewPage: Int!
    $reviewPageSize: Int!
    $reviewAccessToken: String
  ) {
    QueryUserById(id: $queryUserByIdId) {
      id
      user_name
      user_deal
      image
      updated_at
      stories(
        storyPage: $storyPage
        storyPageSize: $storyPageSize
        storyAccessToken: $storyAccessToken
      ) {
        id
        user_id
        story_title
        story_synopsis
        story_categories
        story_image
        viewing_restriction
        created_at
        updated_at
        publish
      }
      reviews(
        reviewPage: $reviewPage
        reviewPageSize: $reviewPageSize
        reviewAccessToken: $reviewAccessToken
      ) {
        id
        story_id
        review_title
        review_body
        stars
        created_at
        updated_at
      }
    }
  }
`

const ProfilePage = () => {
  const { userId } = useRouter().query
  const accessToken = supabase.auth.session()?.access_token
  const isMeState = useMemo(() => {
    return isMe(`${userId}`, `${accessToken}`)
  }, [accessToken, userId])

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<QueryUserById>(UserQueryById, {
    variables: {
      queryUserByIdId: userId,
      storyPage: 1,
      storyPageSize: 10,
      reviewPage: 1,
      reviewPageSize: 10,
      reviewAccessToken: `${accessToken}`,
      storyAccessToken: `${accessToken}`,
    },
    fetchPolicy: "cache-and-network",
  })

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      userName: data?.QueryUserById.user_name,
      userDeal: data?.QueryUserById.user_deal,
    },
  })

  const { userDeal, userName } = watch()

  const [updateUser, { error: errorUpdateUser, loading: isLoadingUpdateUser }] =
    useMutation<NexusGenArgTypes["Mutation"]["updateUser"]>(
      UpdateUserMutation,
      {
        variables: {
          accessToken,
          image: data?.QueryUserById.image,
          userDeal: getValues("userDeal"),
          userName: getValues("userName"),
        },
        refetchQueries: [
          {
            query: UserQueryById,
            variables: {
              queryUserByIdId: data?.QueryUserById.id,
            },
          },
        ],
      }
    )

  const handleSubmitData = useCallback(async () => {
    await updateUser({
      variables: {
        accessToken,
        image: data?.QueryUserById.image,
        userDeal: getValues("userDeal"),
        userName: getValues("userName"),
      },
    })
  }, [accessToken, data?.QueryUserById.image, getValues, updateUser])

  useEffect(() => {
    if (data?.QueryUserById) {
      setValue("userName", data.QueryUserById.user_name)
      setValue("userDeal", data.QueryUserById.user_deal)
    }
  }, [data?.QueryUserById, setValue])

  useEffect(() => {
    if (error || errorUpdateUser) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={errorUpdateUser?.message || error?.message}
          />
        )
      })
    }
  }, [error, errorUpdateUser])

  if (isLoading || !userId) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  if (!isLoading && error) {
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
        <div className="flex flex-col justify-center items-center mb-16 w-full">
          <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
            <img
              className="mb-8 w-[100px] h-[100px] rounded-full"
              src={data?.QueryUserById.image || "/img/Vector.png"}
              alt={data?.QueryUserById.user_name || "avatar"}
            />
            <h2 className="mb-4 text-2xl font-bold text-slate-600">
              {data?.QueryUserById.user_name}
            </h2>
            <p className="text-slate-400">{data?.QueryUserById.user_deal}</p>
          </div>
        </div>
      </div>
      {isMeState && (
        <div className="fixed right-5 bottom-5">
          <button
            onClick={handleOpenModal}
            className="flex flex-col justify-center items-center p-4 w-20 h-20 text-yellow-300 bg-purple-500 rounded-full focus:ring-2 ring-purple-300 duration-200"
          >
            <PencilAltIcon className="w-20 h-20" />
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col justify-center items-center w-full">
          <Tab
            color="purple"
            values={[
              {
                label: "詳細",
                children: (
                  <form
                    className="p-4"
                    onSubmit={handleSubmit(handleSubmitData)}
                  >
                    <div className="flex flex-col mb-4 w-full">
                      <label
                        htmlFor="userName"
                        className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500"
                      >
                        <p>ユーザー名</p>
                        <p>{userName?.length}/50</p>
                      </label>
                      <input
                        type="text"
                        max={50}
                        min={2}
                        className="p-2 w-full rounded-lg border-2 border-purple-500 focus:outline-none focus:ring-2 ring-purple-300"
                        {...register("userName", {
                          required: true,
                          minLength: {
                            value: 2,
                            message: "ユーザー名は2文字以上です",
                          },
                          maxLength: {
                            value: 50,
                            message: "ユーザー名は50文字以下です",
                          },
                        })}
                      />
                      {errors && errors.userName && (
                        <p className="text-xs italic text-red-500">
                          {errors.userName.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col mb-4 w-full">
                      <label
                        htmlFor="userDeal"
                        className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500"
                      >
                        <p>自己紹介</p>
                        <p>{userDeal?.length}/1000</p>
                      </label>
                      <textarea
                        className="p-2 w-full h-[300px] rounded-lg border-2 border-purple-500 focus:outline-none focus:ring-2 ring-purple-300 resize-none"
                        {...register("userDeal", {
                          required: true,
                          maxLength: {
                            value: 1000,
                            message: "自己紹介は1000文字以下です",
                          },
                        })}
                      />
                      {errors && errors.userDeal && (
                        <p className="text-xs italic text-red-500">
                          {errors.userDeal.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-center w-full">
                      <Button
                        usage="base"
                        disabled={isLoadingUpdateUser || isLoading}
                        isLoading={isLoadingUpdateUser || isLoading}
                        type="submit"
                        text="更新"
                      />
                    </div>
                  </form>
                ),
              },
            ]}
          />
        </div>
      </Modal>
    </Layout>
  )
}

export default memo(ProfilePage)
