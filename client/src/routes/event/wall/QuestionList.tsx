import React from "react";
import {
  QuestionWallFieldsFragment,
  useQuestionsByEventWallQuery,
  QuestionOrder,
  QuestionQueryInput,
  useQuestionRealtimeSearchWallSubscription,
  QuestionsByEventWallDocument,
} from "../../../generated/graphqlHooks";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";
import { sortQuestionBy } from "../../../utils";
import ListFooter from "../../../components/ListFooter";

interface Props {
  questionQueryInput: QuestionQueryInput;
}

const QuestionList: React.FC<Props> = ({ questionQueryInput }) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const questionsQueryResult = useQuestionsByEventWallQuery({
    fetchPolicy: "network-only",
    variables: { input: questionQueryInput },
  });
  const { data, loading, fetchMore } = questionsQueryResult;

  useQuestionRealtimeSearchWallSubscription({
    variables: {
      eventId: questionQueryInput.eventId,
      hash: data?.questionsByEventWall.hash as string,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.questionRealtimeSearch) {
        const questionRealtimeSearch =
          subscriptionData.data.questionRealtimeSearch;

        if (data) {
          client.writeQuery({
            query: QuestionsByEventWallDocument,
            variables: { input: questionQueryInput },
            data: {
              questionsByEventWall: {
                ...data.questionsByEventWall,
                totalCount: questionRealtimeSearch.totalCount,
                list: data.questionsByEventWall.list
                  // remove
                  .filter(
                    (preQuestion) =>
                      !questionRealtimeSearch.deleteList.includes(
                        preQuestion.id
                      ) &&
                      !questionRealtimeSearch.updateList
                        .map((item) => item.id)
                        .includes(preQuestion.id)
                  )
                  // add
                  .concat(questionRealtimeSearch.insertList)
                  .concat(questionRealtimeSearch.updateList),
              },
            },
          });
        }
      }
    },
  });

  const orderedList = React.useMemo(() => {
    const list = sortQuestionBy<QuestionWallFieldsFragment>(
      questionQueryInput.order || QuestionOrder.Popular
    )(data?.questionsByEventWall.list || []);

    return list;
  }, [data, questionQueryInput]);
  const loadMore = () => {
    if (data?.questionsByEventWall.hasNextPage) {
      fetchMore({
        variables: {
          input: {
            ...questionQueryInput,
            pagination: {
              offset:
                data?.questionsByEventWall.list.length || DEFAULT_PAGE_OFFSET,
              limit: data?.questionsByEventWall.limit || DEFAULT_PAGE_LIMIT,
            },
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            questionsByEventWall: {
              ...fetchMoreResult.questionsByEventWall,
              list: [
                ...prev.questionsByEventWall.list,
                ...fetchMoreResult.questionsByEventWall.list,
              ],
            },
          });
        },
      });
    }
  };

  return (
    <Virtuoso
      style={{ height: "100%", width: "100%" }}
      totalCount={orderedList.length}
      isScrolling={(scrolling) => {
        setIsScrolling(scrolling);
      }}
      endReached={loadMore}
      itemContent={(index) => {
        if (!orderedList[index]) return <div />;
        return (
          <QuestionItem
            question={orderedList[index]}
            isScrolling={isScrolling}
          />
        );
      }}
      components={{
        Footer: () => (
          <ListFooter
            loading={loading}
            hasNextPage={data?.questionsByEventWall.hasNextPage}
          />
        ),
      }}
    />
  );
};

export default QuestionList;
