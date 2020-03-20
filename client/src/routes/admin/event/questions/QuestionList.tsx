import React from "react";
import * as R from "ramda";
import { QueryResult } from "@apollo/react-common";
import {
  useQuestionAddedSubscription,
  useQuestionUpdatedSubscription,
  useQuestionRemovedSubscription,
  useQuestionsByEventQuery,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionsByEventDocument,
  QuestionFieldsFragment,
  QuestionOrder,
  RoleName,
  ReviewStatus
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
  queryVariables: QuestionsByEventQueryVariables;
}

const QuestionList: React.FC<Props> = ({
  eventQueryResult,
  queryVariables
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
    variables: queryVariables
  });
  const { data, loading, fetchMore } = questionsQueryResult;

  // subscriptions
  const shouldQuestionAdd = (
    questionAdded: QuestionFieldsFragment,
    prevData: QuestionsByEventQuery | undefined,
    queryVariables: QuestionsByEventQueryVariables
  ): boolean => {
    // 待新增项与现有列表合并后排序，若末尾项为待新增项，则说明待新增项在当前查询分页边界之外，不予新增
    // BUG: 订阅新增期间，边界有变化时，该方法有漏洞，应该比对 mysql row_number between 0 and limit
    const orderedList = sortQuestionBy<QuestionFieldsFragment>(
      queryVariables.order || QuestionOrder.Popular
    )([...(prevData?.questionsByEvent.list || []), questionAdded]);
    if (orderedList[orderedList.length - 1].id === questionAdded.id) {
      return false;
    }

    return Boolean(
      // 在左侧 Review 列表中
      questionAdded.reviewStatus === ReviewStatus.Review ||
        // 或，在右侧列表中，匹配当前 questionFilter
        ((queryVariables.questionFilter as string) ===
          questionAdded.reviewStatus &&
          // 且，匹配当前 searchString
          (!queryVariables.searchString ||
            // searchString 匹配 content
            questionAdded.content.includes(queryVariables.searchString) ||
            // 或，searchString 匹配 user.name
            questionAdded.author?.name?.includes(queryVariables.searchString)))
    );
  };
  useQuestionAddedSubscription({
    variables: { eventId: queryVariables.eventId, role: RoleName.Admin },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;

        if (data && shouldQuestionAdd(questionAdded, data, queryVariables)) {
          // add
          updateCache(client, queryVariables, {
            questionsByEvent: {
              ...data.questionsByEvent,
              // TODO: should always add
              totalCount: data.questionsByEvent.totalCount + 1,
              list: [questionAdded].concat(
                data.questionsByEvent.list.filter(
                  question => question.id !== questionAdded.id
                )
              )
            }
          });
        }
      }
    }
  });
  useQuestionUpdatedSubscription({
    variables: { eventId: queryVariables.eventId, role: RoleName.Admin }
  });
  useQuestionRemovedSubscription({
    variables: { eventId: queryVariables.eventId, role: RoleName.Admin },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.questionRemoved) {
        const { questionRemoved } = subscriptionData.data;

        if (data) {
          // remove
          updateCache(client, queryVariables, {
            questionsByEvent: {
              ...data.questionsByEvent,
              totalCount: data.questionsByEvent.totalCount - 1,
              list: data.questionsByEvent.list.filter(
                preQuestion => questionRemoved !== preQuestion.id
              )
            }
          });
        }
      }
    }
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
      queryVariables.order || QuestionOrder.Popular
    )(data?.questionsByEvent.list || []);

    return orderedList;
  }, [data, queryVariables]);
  const loadMore = () => {
    if (data?.questionsByEvent.hasNextPage) {
      fetchMore({
        variables: {
          pagination: {
            offset: data?.questionsByEvent.list.length || DEFAULT_PAGE_OFFSET,
            limit: data?.questionsByEvent.limit || DEFAULT_PAGE_LIMIT
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            questionsByEvent: {
              ...fetchMoreResult.questionsByEvent,
              list: [
                ...R.differenceWith<QuestionFieldsFragment>(
                  (a, b) => a.id === b.id,
                  prev.questionsByEvent.list,
                  fetchMoreResult.questionsByEvent.list
                ),
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
