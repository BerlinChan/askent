import React from "react";
import { useParams } from "react-router-dom";
import { QueryResult } from "@apollo/client";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionOrder,
} from "../../../../generated/graphqlHooks";
import QuestionList from "./QuestionList";
import AskFabDialog from "./AskFabDialog";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const LiveQuestions: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult,
}) => {
  const { id } = useParams<{ id: string }>();
  const questionOrderState = React.useState<QuestionOrder>(
    QuestionOrder.Popular
  );
  const questionQueryInput = {
    eventId: id,
    order: questionOrderState[0],
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
  };

  return (
    <React.Fragment>
      <QuestionList
        userQueryResult={userQueryResult}
        eventQueryResult={eventQueryResult}
        questionOrderState={questionOrderState}
        questionQueryInput={questionQueryInput}
      />

      <AskFabDialog />
    </React.Fragment>
  );
};

export default LiveQuestions;
