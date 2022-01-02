import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import "src/styles/index.css"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api",
})

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
