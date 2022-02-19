import gql from "graphql-tag"
import { useMemo } from "react"
import type { NexusGenObjects } from "src/generated/nexus-typegen"
import { supabase } from "src/lib/supabase"
import type { QueryMe } from "src/types/User/query"

import { useSwrQuery } from "../swr"
import type { SwrHookResult } from "../types"

const Me = gql`
  query QueryMe($accessToken: String!) {
    QueryMe(accessToken: $accessToken) {
      id
      user_name
      user_deal
      image
    }
  }
`

export type UseUserObject = NexusGenObjects["User"] | null

export const useUser = (): SwrHookResult<UseUserObject, QueryMe> => {
  const accessToken = useMemo(() => {
    return supabase.auth.session()?.access_token
  }, [])
  const {
    data: userInfo,
    error,
    isLoading,
    mutate,
  } = useSwrQuery<QueryMe>(Me, {
    accessToken: accessToken ? accessToken : null,
  })

  const user: UseUserObject = useMemo(() => {
    if (userInfo) {
      return userInfo.QueryMe
    }
    return null
  }, [userInfo])

  return {
    data: user,
    isLoading,
    error,
    mutate,
  }
}
