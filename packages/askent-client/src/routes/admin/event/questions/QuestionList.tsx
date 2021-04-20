import React from "react";
import { QueryResult } from "@apollo/client";
import {
  EventByIdQuery,
  EventByIdQueryVariables,
} from "../../../../generated/graphqlHooks";
import {
  useQuestionLiveQuerySubscription,
  QuestionLiveQueryFieldsFragment,
  QuestionLiveQuerySubscriptionVariables,
  useQuestionCountLiveQuerySubscription,
} from "../../../../generated/hasuraHooks";
import { Virtuoso } from "react-virtuoso";
import QuestionItem from "./QuestionItem";
import QuestionItemMenu from "./QuestionItemMenu";
import ReplyDialog from "./reply/ReplyDialog";
import ListFooter from "../../../../components/ListFooter";

interface Props {
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  questionLiveQueryInputState: [
    QuestionLiveQuerySubscriptionVariables,
    React.Dispatch<React.SetStateAction<QuestionLiveQuerySubscriptionVariables>>
  ];
}

const QuestionList: React.FC<Props> = ({
  eventQueryResult,
  questionLiveQueryInputState,
}) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);
  const replyDialogState = React.useState({ open: false, questionId: "" });
  const [loading, setLoading] = React.useState(false);
  const [questionLiveQueryData, setQuestionLiveQueryData] = React.useState<
    Array<QuestionLiveQueryFieldsFragment>
  >([]);
  const [
    questionCountLiveQueryData,
    setQuestionCountLiveQueryData,
  ] = React.useState(0);

  const moreMenuContextQuestion = React.useMemo(
    () => questionLiveQueryData.find((item) => item.id === moreMenuState[0].id),
    [questionLiveQueryData, moreMenuState]
  );

  useQuestionLiveQuerySubscription({
    variables: questionLiveQueryInputState[0],
    onSubscriptionData: ({ client, subscriptionData }) => {
    console.log("🚀 ~ file: QuestionList.tsx ~ line 56 ~ subscriptionData", subscriptionData)
      if (subscriptionData.data?.question) {
        setQuestionLiveQueryData(subscriptionData.data?.question);
        setLoading(false);
      }
    },
  });
  useQuestionCountLiveQuerySubscription({
    variables: { where: questionLiveQueryInputState[0].where },
    onSubscriptionData: ({ client, subscriptionData }) => {
      setQuestionCountLiveQueryData(
        subscriptionData.data?.question_aggregate.aggregate?.count || 0
      );
    },
  });

  const handleMoreOpen = (
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
    if (
      questionLiveQueryInputState[0].offset +
        questionLiveQueryInputState[0].limit <
      questionCountLiveQueryData
    ) {
      setLoading(true);
      questionLiveQueryInputState[1]({
        ...questionLiveQueryInputState[0],
        limit: questionLiveQueryInputState[0].limit * 2,
      });
    }
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
        itemContent={(index) => {
          const question: QuestionLiveQueryFieldsFragment =
            questionLiveQueryData[index];

          return (
            <QuestionItem
              question={question}
              eventQueryResult={eventQueryResult}
              handleMoreClick={handleMoreOpen}
              editContent={editContentIdsState[0].includes(question.id)}
              handleEditContentToggle={handleEditContentToggle}
              editContentInputRef={editContentInputRef}
              replyDialogState={replyDialogState}
              isScrolling={isScrolling}
            />
          );
        }}
        components={{
          Footer: () => (
            <ListFooter
              loading={loading}
              hasNextPage={
                questionLiveQueryInputState[0].offset +
                  questionLiveQueryInputState[0].limit <
                questionCountLiveQueryData
              }
            />
          ),
        }}
      />

      <QuestionItemMenu
        question={moreMenuContextQuestion}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
        replyDialogState={replyDialogState}
      />
      <ReplyDialog
        replyDialogState={replyDialogState}
        eventQueryResult={eventQueryResult}
      />
    </React.Fragment>
  );
};

export default QuestionList;
