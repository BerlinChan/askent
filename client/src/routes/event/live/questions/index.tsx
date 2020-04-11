import React from "react";
import { useParams } from "react-router-dom";
import { QueryResult } from "@apollo/react-common";
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
  let { id } = useParams();
  const questionQueryInput = {
    eventId: id as string,
    order: QuestionOrder.Popular,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
  };

  return (
    <React.Fragment>
      <QuestionList
        userQueryResult={userQueryResult}
        eventQueryResult={eventQueryResult}
        questionQueryInput={questionQueryInput}
      />

      <AskFabDialog userQueryResult={userQueryResult} />
    </React.Fragment>
  );
};

export default LiveQuestions;
