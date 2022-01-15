/* eslint-disable import/no-default-export */
/* eslint-disable react/destructuring-assignment */
import "src/styles/index.css"

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import type { AppProps } from "next/app"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api",
})

const MyApp = (props: AppProps) => (
  <ApolloProvider client={client}>
    <props.Component {...props.pageProps} />
  </ApolloProvider>
)

export default MyApp
