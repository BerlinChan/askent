import { from, split, HttpLink, ApolloClient } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { resolvers, typeDefs } from "./resolvers";
import config from "../config";
import { AUTH_TOKEN, HASURA_LIVE_QUERY } from "../constant";
import createCache from "./createCache";

// Restore cache defaults to make the same one in server.js. Ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
const cache = createCache();
const getAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN)
    ? `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
    : "";

const authMiddleware = setContext((operation, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: getAuthToken(),
    },
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
      Authorization: getAuthToken(),
    } as ConnectionParamsType,
  },
});
const apiLink = new HttpLink({
  uri: config.apiUri,
});
const hasuraLink = new HttpLink({
  uri: config.hasuraUri,
});
const hasuraWsLink = new WebSocketLink({
  uri: config.hasuraWsUri,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        Authorization: getAuthToken(),
      },
    } as ConnectionParamsType,
  },
});

const wsLinks = split(
  (operation) => {
    return new RegExp(HASURA_LIVE_QUERY).test(operation.operationName);
  },
  hasuraWsLink,
  wsLink
);
const httpLinks = split(
  (operation) => operation.getContext().clientName === "hasura",
  hasuraLink,
  apiLink
);

const link = from([
  // TODO: apollo error handling, ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors?.length) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
      // switch (graphQLErrors[0].message) {
      //   case "Not Authorised!":
      //     window.location.href = "/unauthorized";
      //     break;
      //   default:
      // }
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
    wsLinks,
    httpLinks
  ),
]);

export default function createApolloClient() {
  return new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers,
    queryDeduplication: true,
    connectToDevTools: true,
  });
}
