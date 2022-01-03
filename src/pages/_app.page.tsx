import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import "src/styles/index.css"
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
