import React from "react";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { getHasNextPage } from "../../../utils";
import ListFooter from "../../../components/ListFooter";
import { QuestionQueryStateType } from "../../admin/event/questions/ActionRight";
import {
  QuestionLiveQuerySubscriptionVariables,
  useQuestionCountLiveQuerySubscription,
  useQuestionLiveQuerySubscription,
  QuestionLiveQueryFieldsFragment,
} from "../../../generated/hasuraHooks";

interface Props {
  questionQueryState: [
    QuestionQueryStateType,
    React.Dispatch<React.SetStateAction<QuestionQueryStateType>>
  ];
  questionQueryInput: QuestionLiveQuerySubscriptionVariables;
}

const QuestionList: React.FC<Props> = ({
  questionQueryState,
  questionQueryInput,
}) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
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

  const loadMore = () => {
    if (hasNextPage) {
      questionQueryState[1]({
        ...questionQueryState[0],
        limit: questionQueryState[0].limit * 2,
      });
    }
  };

  return (
    <Virtuoso
      style={{ height: "100%", width: "100%" }}
      totalCount={questionLiveQueryData.length}
      isScrolling={(scrolling) => {
        setIsScrolling(scrolling);
      }}
      endReached={loadMore}
      itemContent={(index) => {
        return (
          <QuestionItem
            question={questionLiveQueryData[index]}
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
  );
};

export default QuestionList;
