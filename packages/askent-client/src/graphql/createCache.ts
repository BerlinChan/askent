import * as Apollo from "@apollo/client";
import * as R from "ramda";
import {
  InMemoryCache,
  FieldFunctionOptions,
  FieldPolicy,
} from "@apollo/client/cache";
import {
  EventFieldsFragment,
  EventsByMeQuery,
  EventsByMeQueryVariables,
} from "../generated/graphqlHooks";

export default function createCache() {
  // Restore cache defaults to make the same one in server.js. Ref: https://github.com/kriasoft/react-starter-kit/blob/feature/apollo-pure/src/core/createApolloClient/createApolloClient.client.ts
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          eventsByMe: {
            keyArgs: ["eventOwnerFilter", "dateStatusFilter", "searchString"],
            merge(
              existing,
              incoming,
              {
                args,
                readField,
              }: FieldFunctionOptions<
                Apollo.QueryHookOptions<
                  EventsByMeQuery,
                  EventsByMeQueryVariables
                >
              >
            ) {
              return {
                ...incoming,
                list: [
                  ...R.differenceWith<EventFieldsFragment>(
                    (a, b) => readField("id", a) === readField("id", b),
                    existing?.list || [],
                    incoming.list
                  ),
                  ...incoming.list,
                ],
              };
            },
          } as FieldPolicy<EventsByMeQuery["eventsByMe"]>,
        },
      },
    },
  });
}
