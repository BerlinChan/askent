import React from "react";
import { useParams } from "react-router-dom";
import { QueryResult } from "@apollo/client";
import { MeQuery, MeQueryVariables } from "../../../../generated/graphqlHooks";
import QuestionList from "./QuestionList";
import AskFabDialog from "./AskFabDialog";
import { QuestionOrder, QuestionFilter } from "../../../../constant";
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
} from "askent-common/src/constant";
import {
  EventDetailLiveQueryFieldsFragment,
  QuestionLiveQueryAudienceSubscriptionVariables,
} from "../../../../generated/hasuraHooks";
import { getQuestionOrderByCondition } from "../../../../utils";
import { QuestionQueryStateType } from "../../../admin/event/questions/ActionRight";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventDetailData: EventDetailLiveQueryFieldsFragment | undefined;
}

const LiveQuestions: React.FC<Props> = ({
  userQueryResult,
  eventDetailData,
}) => {
  const { id } = useParams<{ id: string }>();
  const questionQueryState = React.useState<QuestionQueryStateType>({
    filter: QuestionFilter.Publish,
    limit: DEFAULT_PAGE_LIMIT,
    offset: DEFAULT_PAGE_OFFSET,
  });
  const questionOrderState = React.useState<QuestionOrder>(
    QuestionOrder.Popular
  );
  const openAskDialogState = React.useState(false);
  const questionQueryInput: QuestionLiveQueryAudienceSubscriptionVariables = {
    where: {
      eventId: { _eq: id },
      reviewStatus: { _eq: questionQueryState[0].filter },
    },
    order_by: getQuestionOrderByCondition(questionOrderState[0]),
    limit: questionQueryState[0].limit,
    offset: questionQueryState[0].offset,
  };

  return (
    <React.Fragment>
      <QuestionList
        userQueryResult={userQueryResult}
        eventDetailData={eventDetailData}
        questionOrderState={questionOrderState}
        questionQueryState={questionQueryState}
        questionQueryInput={questionQueryInput}
        openAskDialogState={openAskDialogState}
      />

      <AskFabDialog openAskDialogState={openAskDialogState} />
    </React.Fragment>
  );
};

export default LiveQuestions;
