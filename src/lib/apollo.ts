/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"

// const httpLink = new HttpLink({
//   uri: `ws://${window.location.host}/api`,
// })

// const wsLink = process.browser
//   ? new WebSocketLink({
//       uri: `ws://${window.location.host}/api`,
//       options: {
//         reconnect: true,
//       },
//     })
//   : undefined

// const splitLink = process.browser
//   ? split(
//       ({ query }) => {
//         const definition = getMainDefinition(query)
//         return (
//           definition.kind === "OperationDefinition" &&
//           definition.operation === "subscription"
//         )
//       },
//       wsLink as WebSocketLink,
//       httpLink
//     )
//   : httpLink

// const apolloClient = new ApolloClient({
//   uri: `ws://${window.location.host}/api`,
//   link: splitLink,
//   cache: new InMemoryCache(),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: "cache-and-network",
//     },
//   },
// })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${process.env.NEXT_PUBLIC_ENDPOINT}/api`,
})

export { client }
