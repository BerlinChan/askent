import React from "react";
import { QueryResult } from "@apollo/client";
import {
  MeQuery,
  MeQueryVariables,
  QuestionOrder,
} from "../../../../generated/graphqlHooks";
import QuestionItem from "./QuestionItem";
import QuestionItemMenu from "./QuestionItemMenu";
import QuestionListHeader from "./QuestionListHeader";
import { Virtuoso } from "react-virtuoso";
import { getHasNextPage } from "../../../../utils";
import ListFooter from "../../../../components/ListFooter";
import {
  EventDetailLiveQueryFieldsFragment,
  QuestionLiveQueryAudienceFieldsFragment,
  QuestionLiveQueryAudienceSubscriptionVariables,
  useQuestionCountLiveQueryAudienceSubscription,
  useQuestionLiveQueryAudienceSubscription,
} from "../../../../generated/hasuraHooks";
import { QuestionQueryStateType } from "../../../admin/event/questions/ActionRight";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventDetailData:EventDetailLiveQueryFieldsFragment|undefined;
  questionOrderState: [
    QuestionOrder,
    React.Dispatch<React.SetStateAction<QuestionOrder>>
  ];
  questionQueryState: [
    QuestionQueryStateType,
    React.Dispatch<React.SetStateAction<QuestionQueryStateType>>
  ];
  questionQueryInput: QuestionLiveQueryAudienceSubscriptionVariables;
}

const QuestionList: React.FC<Props> = ({
  userQueryResult,
  eventDetailData,
  questionOrderState,
  questionQueryState,
  questionQueryInput,
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
  const [loading, setLoading] = React.useState(true);
  const [questionCount, setQuestionCount] = React.useState(0);
  const hasNextPage = getHasNextPage(
    questionQueryInput.offset,
    questionQueryInput.limit,
    questionCount
  );

  useQuestionLiveQueryAudienceSubscription({
    variables: questionQueryInput,
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.question) {
        setQuestionLiveQueryData(subscriptionData.data?.question);
        setLoading(false);
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
      setLoading(true);
      questionQueryState[1]({
        ...questionQueryState[0],
        limit: questionQueryState[0].limit * 2,
      });
    }
  };

  const renderListItem = (index: number) => {
    const question: QuestionLiveQueryAudienceFieldsFragment =
      questionLiveQueryData[index];

    return (
      <QuestionItem
        question={question}
        userQueryResult={userQueryResult}
        handleMoreClick={handleMoreClick}
        editContent={editContentIdsState[0].includes(question.id)}
        handleEditContentToggle={handleEditContentToggle}
        editContentInputRef={editContentInputRef}
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
          Header: () =>
            <QuestionListHeader
              questionOrderState={questionOrderState}
              questionLiveQueryCount={questionCount}
            />,
          Footer: () => (
            <ListFooter loading={loading} hasNextPage={hasNextPage} />
          ),
        }}
      />

      <QuestionItemMenu
        eventDetailData={eventDetailData}
        questionList={questionLiveQueryData}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
      />
    </React.Fragment>
  );
};

export default QuestionList;
