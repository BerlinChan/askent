import { ApolloClient, OperationVariables } from "apollo-client";

interface cacheUpdater<TDocument = any, TVariables = OperationVariables> {
  (
    client: ApolloClient<object>,
    queryDocument: TDocument,
    queryVariables: TVariables,
    resolve: () => {}
  ): void;
}
export function cacheUpdater() {}
