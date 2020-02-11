import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { setContext } from "apollo-link-context";
import { from, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { resolvers, typeDefs } from "./resolvers";
import config from "../config";
import { AUTH_TOKEN } from "../constant";

// TODO: refactor to createChache, ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
const cache = new InMemoryCache();

const authMiddleware = setContext((operation, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: localStorage.getItem(AUTH_TOKEN) || ""
    }
  };
});

type ConnectionParamsType = {
  Authorization?: string;
};
const wsLink = new WebSocketLink({
  uri: config.webSocketUri,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: localStorage.getItem(AUTH_TOKEN) || ""
    } as ConnectionParamsType
  }
});

const httpLink = new HttpLink({
  uri: config.apiUri
});
const link = from([
  // TODO: apollo error handling, ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors?.length) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
      switch (graphQLErrors[0].message) {
        case "Not Authorised!":
          window.location.href = "/unauthorized";
          break;
        default:
      }
    }
    if (networkError) console.warn(`[Network error]: ${networkError}`);
  }),
  authMiddleware,
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
    wsLink,
    httpLink
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
