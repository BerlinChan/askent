import { InMemoryCache, FieldFunctionOptions } from "@apollo/client/cache";
import {
  EventsByMeQuery,
  EventsByMeQueryVariables,
} from "../generated/graphqlHooks";
import * as Apollo from "@apollo/client";

export default function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          eventsByMe: {
            keyArgs: ["dateStatusFilter", "searchString"],
            merge(
              existing: EventsByMeQuery["eventsByMe"] | undefined,
              incoming: EventsByMeQuery["eventsByMe"],
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
                  ...(existing?.list || []).filter(
                    (existingItem) =>
                      !incoming.list
                        .map((incomingItem) => readField("id", incomingItem))
                        .includes(readField("id", existingItem))
                  ),
                  ...incoming.list,
                ],
              };
            },
          },
        },
      },
    },
  });
}
