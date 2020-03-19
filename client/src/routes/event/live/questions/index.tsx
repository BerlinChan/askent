import React from "react";
import { useParams } from "react-router-dom";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionsByEventAudienceQuery,
  QuestionsByEventAudienceQueryVariables,
  useQuestionsByEventAudienceQuery,
  useQuestionAddedAudienceSubscription,
  useQuestionUpdatedAudienceSubscription,
  useQuestionRemovedAudienceSubscription,
  QuestionsByEventAudienceDocument,
  RoleName,
  QuestionOrder
} from "../../../../generated/graphqlHooks";
import { DataProxy } from "apollo-cache";
import QuestionList from "./QuestionList";
import AskFabDialog from "./AskFabDialog";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const LiveQuestions: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult
}) => {
  let { id } = useParams();
  const questionsQueryVariables = {
    eventId: id as string,
    order: QuestionOrder.Popular,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
  };
  const questionsQueryResult = useQuestionsByEventAudienceQuery({
    fetchPolicy: "network-only",
    variables: questionsQueryVariables
  });

  // subscriptions
  const updateCache = (
    cache: DataProxy,
    data: QuestionsByEventAudienceQuery
  ) => {
    cache.writeQuery<
      QuestionsByEventAudienceQuery,
      Omit<QuestionsByEventAudienceQueryVariables, "pagination">
    >({
      query: QuestionsByEventAudienceDocument,
      variables: questionsQueryVariables,
      data
    });
  };
  useQuestionAddedAudienceSubscription({
    variables: { eventId: id as string, role: RoleName.Audience },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;
        const prev = questionsQueryResult.data;

        if (prev) {
          // add
          updateCache(client, {
            questionsByEventAudience: {
              ...prev.questionsByEventAudience,
              totalCount: prev.questionsByEventAudience.totalCount + 1,
              list: [questionAdded].concat(
                prev.questionsByEventAudience.list.filter(
                  question =>
                    question.id !== subscriptionData.data?.questionAdded.id
                )
              )
            }
          });
        }
      }
    }
  });
  useQuestionUpdatedAudienceSubscription({
    variables: { eventId: id as string, role: RoleName.Audience }
  });
  useQuestionRemovedAudienceSubscription({
    variables: { eventId: id as string, role: RoleName.Audience },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const prev = questionsQueryResult.data;

      if (prev) {
        // remove
        updateCache(client, {
          questionsByEventAudience: {
            ...prev.questionsByEventAudience,
            totalCount: prev.questionsByEventAudience.totalCount - 1,
            list: prev.questionsByEventAudience.list.filter(
              preQuestion =>
                subscriptionData.data?.questionRemoved !== preQuestion.id
            )
          }
        });
      }
    }
  });

  return (
    <React.Fragment>
      <QuestionList
        userQueryResult={userQueryResult}
        eventQueryResult={eventQueryResult}
        questionsQueryResult={questionsQueryResult}
        order={questionsQueryVariables.order}
      />

      <AskFabDialog userQueryResult={userQueryResult} />
    </React.Fragment>
  );
};

export default LiveQuestions;
