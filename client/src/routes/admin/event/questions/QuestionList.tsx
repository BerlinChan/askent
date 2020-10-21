import React from "react";
import { QueryResult } from "@apollo/client";
import {
  QuestionsByEventDocument,
  useQuestionsByEventQuery,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionFieldsFragment,
  QuestionOrder,
  QuestionQueryInput,
  useQuestionRealtimeSearchSubscription,
} from "../../../../generated/graphqlHooks";
import { Virtuoso } from "react-virtuoso";
import QuestionItem from "./QuestionItem";
import QuestionListMenu from "./QuestionListMenu";
import ReplyDialog from "./reply/ReplyDialog";
import ListFooter from "../../../../components/ListFooter";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../../constant";
import { sortQuestionBy } from "../../../../utils";

interface Props {
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  questionQueryInput: QuestionQueryInput;
}

const QuestionList: React.FC<Props> = ({
  eventQueryResult,
  questionQueryInput,
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
    variables: { input: questionQueryInput },
  });
  const { data, loading, fetchMore } = questionsQueryResult;

  useQuestionRealtimeSearchSubscription({
    variables: {
      eventId: questionQueryInput.eventId,
      hash: questionsQueryResult.data?.questionsByEvent.hash as string,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.questionRealtimeSearch) {
        const questionRealtimeSearch =
          subscriptionData.data.questionRealtimeSearch;

        if (data) {
          client.writeQuery({
            query: QuestionsByEventDocument,
            variables: { input: questionQueryInput },
            data: {
              questionsByEvent: {
                ...data.questionsByEvent,
                totalCount: questionRealtimeSearch.totalCount,
                list: data.questionsByEvent.list
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

  const handleMoreOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    moreMenuState[1]({ anchorEl: event.currentTarget, id });
  };
  const handleMoreClose = () => {
    moreMenuState[1]({ anchorEl: null, id: "" });
  };

  const [replyQuestionId, setReplyQuestionId] = React.useState("");
  const handleOpenReply = (id: string) => {
    setReplyQuestionId(id);
  };
  const handleCloseReply = () => {
    setReplyQuestionId("");
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

  const orderedList = React.useMemo(() => {
    const orderedList = sortQuestionBy<QuestionFieldsFragment>(
      questionQueryInput.order || QuestionOrder.Popular
    )(data?.questionsByEvent.list || []);

    return orderedList;
  }, [data, questionQueryInput]);
  const loadMore = () => {
    if (data?.questionsByEvent.hasNextPage) {
      fetchMore({
        variables: {
          input: {
            ...questionQueryInput,
            pagination: {
              offset: data?.questionsByEvent.list.length || DEFAULT_PAGE_OFFSET,
              limit: data?.questionsByEvent.limit || DEFAULT_PAGE_LIMIT,
            },
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            questionsByEvent: {
              ...fetchMoreResult.questionsByEvent,
              list: [
                ...prev.questionsByEvent.list,
                ...fetchMoreResult.questionsByEvent.list,
              ],
            },
          });
        },
      });
    }
  };

  return (
    <React.Fragment>
      <Virtuoso
        style={{ height: "100%", width: "100%" }}
        totalCount={orderedList.length}
        scrollingStateChange={(scrolling) => {
          setIsScrolling(scrolling);
        }}
        endReached={loadMore}
        item={(index) => {
          const question: QuestionFieldsFragment | undefined =
            orderedList[index];
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
        handleOpenReply={handleOpenReply}
      />
      <ReplyDialog questionId={replyQuestionId} onCancel={handleCloseReply} />
    </React.Fragment>
  );
};

export default QuestionList;
