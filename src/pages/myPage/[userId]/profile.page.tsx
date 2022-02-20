/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import "react-image-crop/dist/ReactCrop.css"

import { useMutation } from "@apollo/client"
import { gql } from "graphql-tag"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Switch } from "src/components/atoms/Switch"
import { Layout } from "src/components/Layout"
import { LoadingLogo } from "src/components/Loading"
import type { NexusGenArgTypes } from "src/generated/nexus-typegen"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import { isMe } from "src/tools/state"
import type { QueryUserById } from "src/types/User/query"
import type { GoogleUserMetadata } from "src/types/User/shcame"

const UserCreate = gql`
  mutation CreateUser(
    $userName: String!
    $userDeal: String!
    $accessToken: String!
    $image: String
  ) {
    createUser(
      userName: $userName
      userDeal: $userDeal
      accessToken: $accessToken
      image: $image
    ) {
      id
    }
  }
`

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
  query QueryUserById($queryUserByIdId: String!) {
    QueryUserById(id: $queryUserByIdId) {
      id
      user_name
      user_deal
      image
      updated_at
    }
  }
`

const ProfilePage = () => {
  const { userId } = useRouter().query
  const user = supabase.auth.user()
  const googleAccountMetadata = user?.user_metadata as GoogleUserMetadata
  const accessToken = supabase.auth.session()?.access_token
  const isMeState = useMemo(() => {
    return isMe(`${userId}`, `${accessToken}`)
  }, [accessToken, userId])
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [isStorage, setIsStorage] = useState<boolean>(false)

  const handleToggle = useCallback(() => {
    setIsStorage(pre => {
      return !pre
    })
  }, [])

  const getAvatorImageUrl = useCallback(() => {
    const { publicURL } = supabase.storage
      .from("management")
      .getPublicUrl(`${userId}/avatar`)
    setAvatarUrl(publicURL as string)
  }, [userId])

  const { data, error, isLoading, mutate } = useSwrQuery<QueryUserById>(
    UserQueryById,
    {
      queryUserByIdId: userId,
    }
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
      userName: "",
      userDeal: "",
      imageUrl: "",
    },
  })

  const { userDeal, userName } = watch()

  const [updateUser, { error: errorUpdateUser, loading: isLoadingUpdateUser }] =
    useMutation<NexusGenArgTypes["Mutation"]["updateUser"]>(UpdateUserMutation)

  const [createUser, { error: errorCreateUser, loading: isLoadingCreateUser }] =
    useMutation(UserCreate)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = useCallback(async () => {
    try {
      await createUser({
        variables: {
          accessToken,
          userDeal: `${googleAccountMetadata?.full_name}です。よろしくお願いします。`,
          userName: googleAccountMetadata?.full_name,
          image: googleAccountMetadata?.picture,
        },
      })
      toast.custom(t => {
        return (
          <Alert t={t} title="プロフィールを作成しました" usage="success" />
        )
      })
      mutate()
    } catch (error) {
      toast.custom(t => {
        return (
          <Alert t={t} title="プロフィールの作成に失敗しました" usage="error" />
        )
      })
    }
  }, [
    accessToken,
    createUser,
    googleAccountMetadata?.full_name,
    googleAccountMetadata?.picture,
    mutate,
  ])

  const handleSubmitData = useCallback(async () => {
    await updateUser({
      variables: {
        accessToken,
        image: isStorage
          ? avatarUrl || data?.QueryUserById?.image
          : getValues("imageUrl") || data?.QueryUserById?.image,
        userDeal: getValues("userDeal"),
        userName: getValues("userName"),
      },
    })
      .then(() => {
        toast.custom(t => {
          return (
            <Alert t={t} title="プロフィールを更新しました" usage="success" />
          )
        })
        mutate()
      })
      .catch(error => {
        toast.custom(t => {
          return (
            <Alert
              t={t}
              title="プロフィールの更新中にエラーが発生しました"
              usage="error"
              message={error.message}
            />
          )
        })
      })
  }, [
    accessToken,
    avatarUrl,
    data?.QueryUserById?.image,
    getValues,
    isStorage,
    mutate,
    updateUser,
  ])

  useEffect(() => {
    if (data && data.QueryUserById) {
      setValue("userName", data.QueryUserById?.user_name || "")
      setValue("userDeal", data.QueryUserById?.user_deal || "")
    }
  }, [data, data?.QueryUserById, setValue])

  useEffect(() => {
    getAvatorImageUrl()
  }, [getAvatorImageUrl, userId])

  useEffect(() => {
    if (errorUpdateUser || errorCreateUser) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={errorUpdateUser?.message || errorCreateUser?.message}
          />
        )
      })
    }
  }, [errorCreateUser, errorUpdateUser])

  useEffect(() => {
    if (error) {
      error.response.errors.map(error => {
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
  }, [error])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
          <LoadingLogo />
        </div>
      </Layout>
    )
  }

  if (error) {
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
      <div className="p-8">
        {isMeState && (
          <>
            {data?.QueryUserById ? (
              <form className="p-4" onSubmit={handleSubmit(handleSubmitData)}>
                <div className="flex flex-col justify-center items-center mb-8 w-full">
                  <div className="flex flex-col items-center w-[300px] sm:w-[400px] xl:w-[600px]">
                    <img
                      className="object-cover object-center mb-8 w-[100px] h-[100px] rounded-full"
                      src={data?.QueryUserById?.image || "/img/Vector.png"}
                      alt={data?.QueryUserById?.user_name || "avatar"}
                    />
                  </div>
                </div>
                <div className="flex flex-col mb-4 w-full">
                  <label
                    htmlFor="avatar"
                    className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500"
                  >
                    <p>
                      {isStorage
                        ? "コンテンツからプロフィール画像を設定"
                        : "URLからプロフィール画像を設定"}
                    </p>
                  </label>
                  <div className="mb-4">
                    <Switch
                      checked={isStorage}
                      onToggle={handleToggle}
                      size="medium"
                    />
                  </div>

                  <div className="flex flex-col justify-center items-center w-full">
                    {isStorage ? (
                      <img
                        className="object-cover object-center w-[100px] h-[100px] rounded-full"
                        src={avatarUrl}
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-full">
                        <input
                          type="text"
                          max={1000}
                          className="p-2 mb-4 w-full rounded-lg border-2 border-purple-500 focus:outline-none focus:ring-2 ring-purple-300"
                          {...register("imageUrl", {
                            maxLength: {
                              value: 1000,
                              message: "URLは1000文字以下にしてください",
                            },
                          })}
                        />
                        {errors && errors.imageUrl && (
                          <p className="text-xs italic text-red-500">
                            {errors.imageUrl.message}
                          </p>
                        )}
                        <div className="flex flex-col justify-center items-center w-full">
                          <img
                            className="object-cover object-center w-[100px] h-[100px] rounded-full"
                            src={getValues("imageUrl")}
                            alt="avatar"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                    primary
                    usage="base"
                    disabled={isLoadingUpdateUser}
                    isLoading={isLoadingUpdateUser}
                    type="submit"
                    text="更新"
                  />
                </div>
              </form>
            ) : (
              <Button
                primary
                usage="base"
                onClick={onSubmit}
                disabled={isLoadingCreateUser}
                isLoading={isLoadingCreateUser}
                type="button"
                text="プロフィール作成"
              />
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default memo(ProfilePage)
