import React from "react";
import {
  QuestionsByEventWallQuery,
  QuestionsByEventWallQueryVariables,
  QuestionWallFieldsFragment,
  QuestionsByEventWallDocument,
  useQuestionsByEventWallQuery,
  // useQuestionAddedWallSubscription,
  // useQuestionUpdatedWallSubscription,
  // useQuestionRemovedWallSubscription,
  QuestionOrder,
  RoleName,
  QuestionSearchInput
} from "../../../generated/graphqlHooks";
import { DataProxy } from "apollo-cache";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";
import { sortQuestionBy } from "../../../utils";
import ListFooter from "../../../components/ListFooter";

function updateCache(
  cache: DataProxy,
  queryVariables: QuestionsByEventWallQueryVariables,
  data: QuestionsByEventWallQuery
): void {
  cache.writeQuery<
    QuestionsByEventWallQuery,
    Omit<QuestionsByEventWallQueryVariables, "pagination">
  >({
    query: QuestionsByEventWallDocument,
    variables: queryVariables,
    data
  });
}

interface Props {
  questionSearchInput: QuestionSearchInput;
}

const QuestionList: React.FC<Props> = ({ questionSearchInput }) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const questionsWallQueryResult = useQuestionsByEventWallQuery({
    fetchPolicy: "network-only",
    variables: { input: questionSearchInput }
  });
  const { data, loading, fetchMore } = questionsWallQueryResult;

  // subscription
  // useQuestionAddedWallSubscription({
  //   variables: {
  //     eventId: queryVariables.eventId,
  //     asRole: RoleName.Wall,
  //     order: queryVariables.order,
  //     limit: data?.questionsByEventWall.list.length
  //   },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     if (subscriptionData.data) {
  //       const { questionAdded } = subscriptionData.data;

  //       if (data) {
  //         // add
  //         updateCache(client, queryVariables, {
  //           questionsByEventWall: {
  //             ...data.questionsByEventWall,
  //             totalCount: data.questionsByEventWall.totalCount + 1,
  //             list: [questionAdded].concat(
  //               data.questionsByEventWall.list.filter(
  //                 question =>
  //                   question.id !== subscriptionData.data?.questionAdded.id
  //               )
  //             )
  //           }
  //         });
  //       }
  //     }
  //   }
  // });
  // useQuestionUpdatedWallSubscription({
  //   variables: { eventId: queryVariables.eventId, asRole: RoleName.Wall }
  // });
  // useQuestionRemovedWallSubscription({
  //   variables: { eventId: queryVariables.eventId, asRole: RoleName.Wall },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     if (subscriptionData.data?.questionRemoved) {
  //       const { questionRemoved } = subscriptionData.data;

  //       if (data) {
  //         // remove
  //         updateCache(client, queryVariables, {
  //           questionsByEventWall: {
  //             ...data.questionsByEventWall,
  //             totalCount: data.questionsByEventWall.totalCount - 1,
  //             list: data.questionsByEventWall.list.filter(
  //               preQuestion => questionRemoved !== preQuestion.id
  //             )
  //           }
  //         });
  //       }
  //     }
  //   }
  // });

  const orderedList = React.useMemo(() => {
    const list = sortQuestionBy<QuestionWallFieldsFragment>(
      questionSearchInput.order || QuestionOrder.Popular
    )(data?.questionsByEventWall.list || []);

    return list;
  }, [data, questionSearchInput]);
  const loadMore = () => {
    if (data?.questionsByEventWall.hasNextPage) {
      fetchMore({
        variables: {
          input: {
            ...questionSearchInput,
            pagination: {
              offset:
                data?.questionsByEventWall.list.length || DEFAULT_PAGE_OFFSET,
              limit: data?.questionsByEventWall.limit || DEFAULT_PAGE_LIMIT
            }
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            questionsByEventWall: {
              ...fetchMoreResult.questionsByEventWall,
              list: [
                ...prev.questionsByEventWall.list,
                ...fetchMoreResult.questionsByEventWall.list
              ]
            }
          });
        }
      });
    }
  };

  return (
    <Virtuoso
      style={{ height: "100%", width: "100%" }}
      totalCount={orderedList.length}
      scrollingStateChange={scrolling => {
        setIsScrolling(scrolling);
      }}
      endReached={loadMore}
      item={index => {
        if (!orderedList[index]) return <div />;
        return (
          <QuestionItem
            question={orderedList[index]}
            isScrolling={isScrolling}
          />
        );
      }}
      footer={() => (
        <ListFooter
          loading={loading}
          hasNextPage={data?.questionsByEventWall.hasNextPage}
        />
      )}
    />
  );
};

export default QuestionList;
