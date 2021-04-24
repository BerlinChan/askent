import React from "react";
import { useParams } from "react-router-dom";
import { QueryResult } from "@apollo/client";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionOrder,
  QuestionFilter,
} from "../../../../generated/graphqlHooks";
import QuestionList from "./QuestionList";
import AskFabDialog from "./AskFabDialog";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";
import { QuestionLiveQueryAudienceSubscriptionVariables } from "../../../../generated/hasuraHooks";
import { getQuestionOrderByCondition } from "../../../../utils";
import { QuestionQueryStateType } from "../../../admin/event/questions/ActionRight";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const LiveQuestions: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult,
}) => {
  const { id } = useParams<{ id: string }>();
  const questionQueryState = React.useState<QuestionQueryStateType>({
    filter:QuestionFilter.Publish,
    limit: DEFAULT_PAGE_LIMIT,
    offset: DEFAULT_PAGE_OFFSET,
  });
  const questionOrderState = React.useState<QuestionOrder>(
    QuestionOrder.Popular
  );
  const questionQueryInput: QuestionLiveQueryAudienceSubscriptionVariables = {
    userId: userQueryResult.data?.me.id,
    where: { eventId: { _eq: id } },
    order_by: getQuestionOrderByCondition(questionOrderState[0]),
    limit: questionQueryState[0].limit,
    offset: questionQueryState[0].offset,
  };

  return (
    <React.Fragment>
      <QuestionList
        userQueryResult={userQueryResult}
        eventQueryResult={eventQueryResult}
        questionOrderState={questionOrderState}
        questionQueryState={questionQueryState}
        questionQueryInput={questionQueryInput}
      />

      <AskFabDialog />
    </React.Fragment>
  );
};

export default LiveQuestions;
