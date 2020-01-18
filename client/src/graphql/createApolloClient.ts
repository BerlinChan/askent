import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { from, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { resolvers, typeDefs } from "./resolvers";
import config from "../config";
import { AUTH_TOKEN } from "../constant";

// TODO: refactor to createChache, ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
// TODO: presist cache for token & user info/config, ref: https://www.apollographql.com/docs/react/caching/cache-interaction/#cache-persistence
const cache = new InMemoryCache();

// TODO: apollo error handling, ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
const link = from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.warn(`[Network error]: ${networkError}`);
  }),
  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    new WebSocketLink({
      uri: config.webSocketUri,
      options: {
        reconnect: true
      }
    }),
    new HttpLink({
      uri: config.api,
      headers: {
        Authorization: localStorage.getItem(AUTH_TOKEN)
      }
    })
  )
]);

export default function createApolloClient() {
  return new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers,
    queryDeduplication: true,
    connectToDevTools: true
  });
}
