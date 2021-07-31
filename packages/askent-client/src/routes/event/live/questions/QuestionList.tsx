import React from "react";
import { QueryResult } from "@apollo/client";
import { MeQuery, MeQueryVariables } from "../../../../generated/graphqlHooks";
import { Props as AskFabDialogProps } from "./AskFabDialog";
import QuestionItem from "./QuestionItem";
import QuestionItemMenu from "./QuestionItemMenu";
import QuestionListHeader from "./QuestionListHeader";
import ListFooter from "../../../../components/ListFooter";
import ReplyDialog from "./reply/ReplyDialog";
import { Virtuoso } from "react-virtuoso";
import { getHasNextPage } from "../../../../utils";
import {
  EventDetailLiveQueryFieldsFragment,
  QuestionLiveQueryAudienceFieldsFragment,
  QuestionLiveQueryAudienceSubscriptionVariables,
  useQuestionCountLiveQueryAudienceSubscription,
  useQuestionLiveQueryAudienceSubscription,
} from "../../../../generated/hasuraHooks";
import { QuestionQueryStateType } from "../../../admin/event/questions/ActionRight";
import { QuestionOrder } from "../../../../constant";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventDetailData: EventDetailLiveQueryFieldsFragment | undefined;
  questionOrderState: [
    QuestionOrder,
    React.Dispatch<React.SetStateAction<QuestionOrder>>
  ];
  questionQueryState: [
    QuestionQueryStateType,
    React.Dispatch<React.SetStateAction<QuestionQueryStateType>>
  ];
  questionQueryInput: QuestionLiveQueryAudienceSubscriptionVariables;
  openAskDialogState: AskFabDialogProps["openAskDialogState"];
}

const QuestionList: React.FC<Props> = ({
  userQueryResult,
  eventDetailData,
  questionOrderState,
  questionQueryState,
  questionQueryInput,
  openAskDialogState,
}) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);
  const [questionLiveQueryData, setQuestionLiveQueryData] = React.useState<
    QuestionLiveQueryAudienceFieldsFragment[]
  >([]);
  const [questionCount, setQuestionCount] = React.useState(0);
  const hasNextPage = getHasNextPage(
    questionQueryInput.offset,
    questionQueryInput.limit,
    questionCount
  );
  const replyDialogState = React.useState({ open: false, questionId: "" });

  const questionMoreTarget = questionLiveQueryData.find(
    (question) => question.id === moreMenuState[0].id
  );

  const {loading}=useQuestionLiveQueryAudienceSubscription({
    variables: questionQueryInput,
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.question) {
        setQuestionLiveQueryData(subscriptionData.data?.question);
      }
    },
  });

  useQuestionCountLiveQueryAudienceSubscription({
    variables: { where: questionQueryInput.where },
    onSubscriptionData: ({ client, subscriptionData }) => {
      setQuestionCount(
        subscriptionData.data?.question_aggregate.aggregate?.count || 0
      );
    },
  });

  const handleMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    moreMenuState[1]({ anchorEl: event.currentTarget, id });
  };
  const handleMoreClose = () => {
    moreMenuState[1]({ anchorEl: null, id: "" });
  };

  const handleEditContentToggle = (id: string) => {
    const findId = editContentIdsState[0].find((item) => item === id);
    editContentIdsState[1](
      findId
        ? editContentIdsState[0].filter((item) => item !== id)
        : editContentIdsState[0].concat([id])
    );
    handleMoreClose();
    setTimeout(() => editContentInputRef.current?.focus(), 100);
  };

  const loadMore = () => {
    if (hasNextPage) {
      questionQueryState[1]({
        ...questionQueryState[0],
        limit: questionQueryState[0].limit * 2,
      });
    }
  };

  const renderListItem = (index: number) => {
    const question = questionLiveQueryData[index];

    return (
      <QuestionItem
        question={question}
        userQueryResult={userQueryResult}
        handleMoreClick={handleMoreClick}
        editContent={editContentIdsState[0].includes(question.id)}
        handleEditContentToggle={handleEditContentToggle}
        editContentInputRef={editContentInputRef}
        replyDialogState={replyDialogState}
        isScrolling={isScrolling}
      />
    );
  };

  return (
    <React.Fragment>
      <Virtuoso
        style={{ height: "100%", width: "100%" }}
        totalCount={questionLiveQueryData.length}
        isScrolling={(scrolling) => {
          setIsScrolling(scrolling);
        }}
        endReached={loadMore}
        itemContent={renderListItem}
        components={{
          Header: () => (
            <QuestionListHeader
              questionOrderState={questionOrderState}
              questionLiveQueryCount={questionCount}
              openAskDialogState={openAskDialogState}
            />
          ),
          Footer: () => (
            <ListFooter loading={loading} hasNextPage={hasNextPage} />
          ),
        }}
      />

      <QuestionItemMenu
        userQueryResult={userQueryResult}
        eventDetailData={eventDetailData}
        question={questionMoreTarget}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
        replyDialogState={replyDialogState}
      />
      <ReplyDialog
        replyDialogState={replyDialogState}
        eventDetailData={eventDetailData}
        userQueryResult={userQueryResult}
      />
    </React.Fragment>
  );
};

export default QuestionList;
