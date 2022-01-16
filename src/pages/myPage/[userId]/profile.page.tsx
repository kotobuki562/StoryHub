/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { useQuery } from "@apollo/client"
import { gql } from "graphql-tag"
import { useRouter } from "next/router"
import { memo, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Layout } from "src/components/Layout/Layout"
import { LoadingLogo } from "src/components/Loading"
import { supabase } from "src/lib/supabase"
import { isMe } from "src/tools/state"
import type { QueryUserById } from "src/types/User/query"

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
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm()

  if (error) {
    throw new Error(error.message)
  }

  if (isLoading) {
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
    </Layout>
  )
}

export default memo(ProfilePage)
