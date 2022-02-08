/* eslint-disable import/no-default-export */
/* eslint-disable react/destructuring-assignment */
import "src/styles/index.css"

import { ApolloProvider } from "@apollo/client"
import request from "graphql-request"
import type { AppProps } from "next/app"
import { client } from "src/lib/apollo"
import { SWRConfig } from "swr"

const fetcher = async (query: string, variables: any) => {
  const res = await request("/api", query, variables)
  return res
}

const MyApp = (props: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <SWRConfig value={{ fetcher }}>
        <props.Component {...props.pageProps} />
      </SWRConfig>
    </ApolloProvider>
  )
}

export default MyApp
