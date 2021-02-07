import { InMemoryCache, FieldFunctionOptions } from "@apollo/client/cache";
import {
  EventsByMeQuery,
  EventsByMeQueryVariables,
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
          questionsByEvent: {
            keyArgs: [
              "input",
              ["eventId", "questionFilter", "searchString", "order"],
            ],
            merge(
              existing: QuestionsByEventQuery["questionsByEvent"] | undefined,
              incoming: QuestionsByEventQuery["questionsByEvent"]
            ) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          },
          questionsByEventAudience: {
            keyArgs: [
              "input",
              ["eventId", "questionFilter", "searchString", "order"],
            ],
            merge(
              existing:
                | QuestionsByEventAudienceQuery["questionsByEventAudience"]
                | undefined,
              incoming: QuestionsByEventAudienceQuery["questionsByEventAudience"]
            ) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          },
          questionsByEventWall: {
            keyArgs: [
              "input",
              ["eventId", "questionFilter", "searchString", "order"],
            ],
            merge(
              existing:
                | QuestionsByEventWallQuery["questionsByEventWall"]
                | undefined,
              incoming: QuestionsByEventWallQuery["questionsByEventWall"]
            ) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          },
          questionsByMe: {
            keyArgs: ["eventId"],
            merge(
              existing: QuestionsByMeQuery["questionsByMe"] | undefined,
              incoming: QuestionsByMeQuery["questionsByMe"]
            ) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          },
          repliesByQuestion: {
            keyArgs: ["input", ["questionId"]],
            merge(
              existing: RepliesByQuestionQuery["repliesByQuestion"] | undefined,
              incoming: RepliesByQuestionQuery["repliesByQuestion"]
            ) {
              return {
                ...incoming,
                list: [...(existing?.list || []), ...incoming.list],
              };
            },
          },
        },
      },
      
    },
  });
}
