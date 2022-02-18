import type { KeyedMutator } from "swr"

export type SwrHookError = {
  extensions: {
    code: string
  }
  message: string
}

export type SwrHookResponseError = {
  response: {
    errors: SwrHookError[]
  }
}

export type SwrHookResult<T, M> = {
  data: T | null
  error: SwrHookResponseError | null | undefined
  isLoading: boolean
  mutate: KeyedMutator<M>
}
