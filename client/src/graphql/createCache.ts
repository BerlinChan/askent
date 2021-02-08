import {
  InMemoryCache,
  FieldFunctionOptions,
  FieldPolicy,
} from "@apollo/client/cache";
import {
  EventsByMeQuery,
  EventsByMeQueryVariables,
  QuestionQueryInput,
  QuestionsByEventQuery,
  QuestionsByEventAudienceQuery,
  QuestionsByEventWallQuery,
  QuestionsByMeQuery,
  RepliesByQuestionQuery,
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
          } as FieldPolicy<EventsByMeQuery["eventsByMe"]>,
          questionsByEvent: {
            keyArgs: [
              "input",
              [
                "eventId",
                "questionFilter",
                "searchString",
                "order",
              ] as (keyof QuestionQueryInput)[],
            ],
            merge(existing, incoming, { variables }) {
              if (variables?.type === "subscription") {
                return incoming;
              } else {
                return {
                  ...incoming,
                  list: [...(existing?.list || []), ...incoming.list],
                };
              }
            },
          } as FieldPolicy<QuestionsByEventQuery["questionsByEvent"]>,
          questionsByEventAudience: {
            keyArgs: [
              "input",
              ["eventId", "questionFilter", "searchString", "order"],
            ],
            merge(existing, incoming) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          } as FieldPolicy<
            QuestionsByEventAudienceQuery["questionsByEventAudience"]
          >,
          questionsByEventWall: {
            keyArgs: [
              "input",
              ["eventId", "questionFilter", "searchString", "order"],
            ],
            merge(existing, incoming) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          } as FieldPolicy<QuestionsByEventWallQuery["questionsByEventWall"]>,
          questionsByMe: {
            keyArgs: ["eventId"],
            merge(existing, incoming) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          } as FieldPolicy<QuestionsByMeQuery["questionsByMe"]>,
          repliesByQuestion: {
            keyArgs: ["input", ["questionId"]],
            merge(existing, incoming) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          } as FieldPolicy<RepliesByQuestionQuery["repliesByQuestion"]>,
        },
      },
    },
  });
}
