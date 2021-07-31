import React from "react";
import {
  useQuestionLiveQuerySubscription,
  QuestionLiveQueryFieldsFragment,
  QuestionLiveQuerySubscriptionVariables,
  useQuestionCountLiveQuerySubscription,
  EventDetailLiveQueryFieldsFragment,
} from "../../../../generated/hasuraHooks";
import { Virtuoso } from "react-virtuoso";
import QuestionItem from "./QuestionItem";
import QuestionItemMenu from "./QuestionItemMenu";
import ReplyDialog from "./reply/ReplyDialog";
import ListFooter from "../../../../components/ListFooter";
import { QuestionQueryStateType } from "./ActionRight";
import { getHasNextPage } from "../../../../utils";

interface Props {
  eventDetailData: EventDetailLiveQueryFieldsFragment | undefined;
  questionQueryState: [
    QuestionQueryStateType,
    React.Dispatch<React.SetStateAction<QuestionQueryStateType>>
  ];
  questionQueryInput: QuestionLiveQuerySubscriptionVariables;
}

const QuestionList: React.FC<Props> = ({
  eventDetailData,
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
  const replyDialogState = React.useState({ open: false, questionId: "" });
  const [questionLiveQueryData, setQuestionLiveQueryData] = React.useState<
    Array<QuestionLiveQueryFieldsFragment>
  >([]);
  const [questionCountLiveQueryData, setQuestionCountLiveQueryData] =
    React.useState(0);
  const hasNextPage = getHasNextPage(
    questionQueryInput.offset,
    questionQueryInput.limit,
    questionCountLiveQueryData
  );

  const moreMenuContextQuestion = React.useMemo(
    () => questionLiveQueryData.find((item) => item.id === moreMenuState[0].id),
    [questionLiveQueryData, moreMenuState]
  );

  const { loading } = useQuestionLiveQuerySubscription({
    variables: questionQueryInput,
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.question) {
        setQuestionLiveQueryData(subscriptionData.data?.question);
      }
    },
  });
  useQuestionCountLiveQuerySubscription({
    variables: { where: questionQueryInput.where },
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
    if (hasNextPage) {
      questionQueryState[1]({
        ...questionQueryState[0],
        limit: questionQueryState[0].limit * 2,
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
              eventDetailData={eventDetailData}
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
            <ListFooter loading={loading} hasNextPage={hasNextPage} />
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
        eventDetailData={eventDetailData}
      />
    </React.Fragment>
  );
};

export default QuestionList;
