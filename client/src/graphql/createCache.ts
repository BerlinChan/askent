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
  QuestionQueryInput,
  QuestionFieldsFragment,
  QuestionsByEventQuery,
  QuestionAudienceFieldsFragment,
  QuestionsByEventAudienceQuery,
  QuestionWallFieldsFragment,
  QuestionsByEventWallQuery,
  QuestionsByMeQuery,
  ReplyFieldsFragment,
  RepliesByQuestionQuery,
} from "../generated/graphqlHooks";

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
            merge(existing, incoming, { readField }) {
              return {
                ...incoming,
                list: [
                  ...R.differenceWith<QuestionFieldsFragment>(
                    (a, b) => readField("id", a) === readField("id", b),
                    existing?.list || [],
                    incoming.list
                  ),
                  ...incoming.list,
                ],
              };
            },
          } as FieldPolicy<QuestionsByEventQuery["questionsByEvent"]>,
          questionsByEventAudience: {
            keyArgs: [
              "input",
              ["eventId", "questionFilter", "searchString", "order"],
            ],
            merge(existing, incoming, { readField }) {
              return {
                ...incoming,
                list: [
                  ...R.differenceWith<QuestionAudienceFieldsFragment>(
                    (a, b) => readField("id", a) === readField("id", b),
                    existing?.list || [],
                    incoming.list
                  ),
                  ...incoming.list,
                ],
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
            merge(existing, incoming, { readField }) {
              return {
                ...incoming,
                list: [
                  ...R.differenceWith<QuestionWallFieldsFragment>(
                    (a, b) => readField("id", a) === readField("id", b),
                    existing?.list || [],
                    incoming.list
                  ),
                  ...incoming.list,
                ],
              };
            },
          } as FieldPolicy<QuestionsByEventWallQuery["questionsByEventWall"]>,
          questionsByMe: {
            keyArgs: ["eventId"],
            merge(existing, incoming, { readField }) {
              return {
                ...incoming,
                list: [
                  ...R.differenceWith<QuestionAudienceFieldsFragment>(
                    (a, b) => readField("id", a) === readField("id", b),
                    existing?.list || [],
                    incoming.list
                  ),
                  ...incoming.list,
                ],
              };
            },
          } as FieldPolicy<QuestionsByMeQuery["questionsByMe"]>,
          repliesByQuestion: {
            keyArgs: ["input", ["questionId"]],
            merge(existing, incoming, { readField }) {
              return {
                ...incoming,
                list: [
                  ...R.differenceWith<ReplyFieldsFragment>(
                    (a, b) => readField("id", a) === readField("id", b),
                    existing?.list || [],
                    incoming.list
                  ),
                  ...incoming.list,
                ],
              };
            },
          } as FieldPolicy<RepliesByQuestionQuery["repliesByQuestion"]>,
        },
      },
    },
  });
}
