/* eslint-disable import/no-default-export */
/* eslint-disable react/destructuring-assignment */
import "src/styles/index.css"

import { ApolloProvider } from "@apollo/client"
import type { AppProps } from "next/app"
import { client } from "src/lib/apollo"


const MyApp = (props: AppProps) => (
  <ApolloProvider client={client}>
    <props.Component {...props.pageProps} />
  </ApolloProvider>
)

export default MyApp
