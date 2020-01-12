import { ApolloClient } from "apollo-client";
import { from } from "apollo-link";
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
  new HttpLink({
    uri: config.api,
    headers: {
      Authorization: localStorage.getItem(AUTH_TOKEN)
    }
  })
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
