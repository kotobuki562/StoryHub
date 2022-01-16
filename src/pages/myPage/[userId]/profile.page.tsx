/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { useMutation, useQuery } from "@apollo/client"
import { PencilAltIcon } from "@heroicons/react/solid"
import { gql } from "graphql-tag"
import { useRouter } from "next/router"
import type { VFC } from "react"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Modal } from "src/components/blocks/Modal"
import { Layout } from "src/components/Layout/Layout"
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
  query QueryUserById($queryUserByIdId: String!) {
    QueryUserById(id: $queryUserByIdId) {
      id
      user_name
      user_deal
      image
      created_at
      updated_at
    }
  }
`

const ProfilePage = () => {
  const { userId } = useRouter().query
  const accessToken = supabase.auth.session()?.access_token
  const isMeState = useMemo(
    () => isMe(`${userId}`, `${accessToken}`),
    [accessToken, userId]
  )

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<QueryUserById>(UserQueryById, {
    variables: {
      queryUserByIdId: userId,
    },
    fetchPolicy: "cache-and-network",
  })

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  if (error) {
    throw new Error(error.message)
  }

  if (isLoading || !userId) {
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
        <div className="flex flex-col justify-center items-center w-full">
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="プロフィールを編集"
      >
        <UpdateUserForm data={data} accessToken={accessToken} />
      </Modal>
    </Layout>
  )
}

type UpdateUserFormProps = {
  data?: QueryUserById
  accessToken?: string
}

const UpdateUserFormComp: VFC<UpdateUserFormProps> = ({
  accessToken,
  data,
}) => {
  const [userName, setUserName] = useState<string | null>("")
  const [userDeal, setUserDeal] = useState<string | null>("")

  const [updateUser, { error: errorUpdateUser, loading: isLoadingUpdateUser }] =
    useMutation<NexusGenArgTypes["Mutation"]["updateUser"]>(
      UpdateUserMutation,
      {
        variables: {
          accessToken,
          image: data?.QueryUserById.image,
          userDeal: userDeal,
          userName: userName,
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

  // eslint-disable-next-line no-console
  console.log(errorUpdateUser, isLoadingUpdateUser)

  const handleChangeUserName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserName(event.target.value)
    },
    [setUserName]
  )

  const handleChangeUserDeal = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserDeal(event.target.value)
    },
    [setUserDeal]
  )

  useEffect(() => {
    if (data?.QueryUserById) {
      setUserName(data.QueryUserById.user_name)
      setUserDeal(data.QueryUserById.user_deal)
    }
  }, [data?.QueryUserById])

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="userName"
          className="mb-4 text-sm font-bold text-slate-600"
        >
          ユーザー名
        </label>
        <input
          type="text"
          className="p-2 w-full rounded-lg border border-gray-300"
          value={userName as string}
          onChange={handleChangeUserName}
        />
      </div>
      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="userDeal"
          className="mb-4 text-sm font-bold text-slate-600"
        >
          自己紹介
        </label>
        <textarea
          className="p-2 w-full rounded-lg border border-gray-300"
          value={userDeal as string}
          onChange={handleChangeUserDeal}
        />
      </div>
      <div className="flex flex-col items-center w-full">
        <button
          type="button"
          className="p-2 w-full rounded-lg border border-gray-300"
          onClick={async e => {
            e.preventDefault()
            updateUser()
          }}
        >
          更新
        </button>
      </div>
    </div>
  )
}

const UpdateUserForm = memo(UpdateUserFormComp)

export default memo(ProfilePage)
