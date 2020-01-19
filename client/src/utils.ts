import { AUTH_TOKEN } from "./constant";
import { ApolloClient, OperationVariables } from "apollo-client";

export function logout() {
  localStorage.removeItem(AUTH_TOKEN);
}

interface cacheUpdater<TDocument = any, TVariables = OperationVariables> {
  (
    client: ApolloClient<object>,
    queryDocument: TDocument,
    queryVariables: TVariables,
    resolve: () => {}
  ): void;
}
export function cacheUpdater() {}
