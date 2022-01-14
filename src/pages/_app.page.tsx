import "src/styles/index.css"

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import type { AppProps } from "next/app"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api",
})

const MyApp = (props: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <props.Component {...props.pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
