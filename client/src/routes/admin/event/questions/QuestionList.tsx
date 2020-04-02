import React from "react";
import { QueryResult } from "@apollo/react-common";
import {
  // useQuestionAddedSubscription,
  // useQuestionUpdatedSubscription,
  // useQuestionRemovedSubscription,
  useQuestionsByEventQuery,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionsByEventDocument,
  QuestionFieldsFragment,
  QuestionOrder,
  QuestionSearchInput,
  RoleName
} from "../../../../generated/graphqlHooks";
import { DataProxy } from "apollo-cache";
import QuestionItem from "./QuestionItem";
import QuestionListMenu from "./QuestionListMenu";
import { Virtuoso } from "react-virtuoso";
import ListFooter from "../../../../components/ListFooter";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../../constant";
import { sortQuestionBy } from "../../../../utils";

function updateCache(
  cache: DataProxy,
  queryVariables: QuestionsByEventQueryVariables,
  data: QuestionsByEventQuery
): void {
  cache.writeQuery({
    query: QuestionsByEventDocument,
    variables: queryVariables,
    data
  });
}

interface Props {
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  questionSearchInput: QuestionSearchInput;
}

const QuestionList: React.FC<Props> = ({
  eventQueryResult,
  questionSearchInput
}) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);
  const questionsQueryResult = useQuestionsByEventQuery({
    fetchPolicy: "network-only",
    variables: { input: questionSearchInput }
  });
  const { data, loading, fetchMore } = questionsQueryResult;

  // subscriptions
  // useQuestionAddedSubscription({
  //   variables: {
  //     eventId: queryVariables.eventId,
  //     asRole: RoleName.Admin,
  //     questionFilter: queryVariables.questionFilter,
  //     searchString: queryVariables.searchString,
  //     order: queryVariables.order,
  //     limit: data?.questionsByEvent.list.length
  //   },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     if (subscriptionData.data) {
  //       const { questionAdded } = subscriptionData.data;

  //       if (data) {
  //         // add
  //         updateCache(client, queryVariables, {
  //           questionsByEvent: {
  //             ...data.questionsByEvent,
  //             // TODO: should always add
  //             totalCount: data.questionsByEvent.totalCount + 1,
  //             list: [questionAdded].concat(
  //               data.questionsByEvent.list.filter(
  //                 question => question.id !== questionAdded.id
  //               )
  //             )
  //           }
  //         });
  //       }
  //     }
  //   }
  // });
  // useQuestionUpdatedSubscription({
  //   variables: { eventId: queryVariables.eventId, asRole: RoleName.Admin }
  // });
  // useQuestionRemovedSubscription({
  //   variables: { eventId: queryVariables.eventId, asRole: RoleName.Admin },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     if (subscriptionData.data?.questionRemoved) {
  //       const { questionRemoved } = subscriptionData.data;

  //       if (data) {
  //         // remove
  //         updateCache(client, queryVariables, {
  //           questionsByEvent: {
  //             ...data.questionsByEvent,
  //             totalCount: data.questionsByEvent.totalCount - 1,
  //             list: data.questionsByEvent.list.filter(
  //               preQuestion => questionRemoved !== preQuestion.id
  //             )
  //           }
  //         });
  //       }
  //     }
  //   }
  // });

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
    const findId = editContentIdsState[0].find(item => item === id);
    editContentIdsState[1](
      findId
        ? editContentIdsState[0].filter(item => item !== id)
        : editContentIdsState[0].concat([id])
    );
    handleMoreClose();
    setTimeout(() => editContentInputRef.current?.focus(), 100);
  };

  const orderedList = React.useMemo(() => {
    const orderedList = sortQuestionBy<QuestionFieldsFragment>(
      questionSearchInput.order || QuestionOrder.Popular
    )(data?.questionsByEvent.list || []);

    return orderedList;
  }, [data, questionSearchInput]);
  const loadMore = () => {
    if (data?.questionsByEvent.hasNextPage) {
      fetchMore({
        variables: {
          input: {
            ...questionSearchInput,
            pagination: {
              offset: data?.questionsByEvent.list.length || DEFAULT_PAGE_OFFSET,
              limit: data?.questionsByEvent.limit || DEFAULT_PAGE_LIMIT
            }
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            questionsByEvent: {
              ...fetchMoreResult.questionsByEvent,
              list: [
                ...prev.questionsByEvent.list,
                ...fetchMoreResult.questionsByEvent.list
              ]
            }
          });
        }
      });
    }
  };

  return (
    <React.Fragment>
      <Virtuoso
        style={{ height: "100%", width: "100%" }}
        totalCount={orderedList.length}
        scrollingStateChange={scrolling => {
          setIsScrolling(scrolling);
        }}
        endReached={loadMore}
        item={index => {
          const question = orderedList[index] as
            | QuestionFieldsFragment
            | undefined;
          if (!question) return <div />;
          return (
            <QuestionItem
              question={question}
              eventQueryResult={eventQueryResult}
              handleMoreClick={handleMoreOpen}
              editContent={editContentIdsState[0].includes(question.id)}
              handleEditContentToggle={handleEditContentToggle}
              editContentInputRef={editContentInputRef}
              isScrolling={isScrolling}
            />
          );
        }}
        footer={() => (
          <ListFooter
            loading={loading}
            hasNextPage={data?.questionsByEvent.hasNextPage}
          />
        )}
      />

      <QuestionListMenu
        questionsQueryResult={questionsQueryResult}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
      />
    </React.Fragment>
  );
};

export default QuestionList;
