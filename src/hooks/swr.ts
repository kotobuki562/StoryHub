import type { DocumentNode } from "graphql"
import { useMemo } from "react"
import type { KeyedMutator } from "swr"
import useSWR from "swr"

import type { SwrHookResponseError } from "./types"

type UseSwrFetchApi<T> = {
  data?: T
  error: SwrHookResponseError | null | undefined
  isLoading: boolean
  mutate: KeyedMutator<T>
}

export const useSwrQuery = <T>(
  node: DocumentNode,
  variables: any
): UseSwrFetchApi<T> => {
  const { data, error, mutate } = useSWR<T>([node, variables], {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  })
  const isLoading = useMemo(() => {
    return !data && !error
  }, [data, error])

  return {
    data,
    error: error as SwrHookResponseError | null | undefined,
    isLoading,
    mutate,
  }
}
