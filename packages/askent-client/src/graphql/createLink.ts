import { from, split, HttpLink } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import config from "../config";
import { TOKEN_KEY, HASURA_LIVE_QUERY } from "../constant";

// Restore cache defaults to make the same one in server.js. Ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
const getAuthToken = () =>
  localStorage.getItem(TOKEN_KEY.USER)
    ? `Bearer ${localStorage.getItem(TOKEN_KEY.USER)}`
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

export default function createLink() {
  return from([
    // TODO: apollo error handling, ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors?.length) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.warn(
            `[GraphQL error]: Message: ${message}, Path: ${path}, Location:`,
            locations
          )
        );
        // switch (graphQLErrors[0].message) {
        //   case "Not Authorised!":
        //     window.location.href = "/unauthorized";
        //     break;
        //   default:
        // }
      }
      if (networkError) console.warn("[Network error]:", networkError);
    }),
    authMiddleware,
    new RetryLink(),
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
}
