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
import {useQuestionRealtimeQuerySubscription} from '../../../../generated/hasuraHooks'
import { Virtuoso } from "react-virtuoso";
import QuestionItem from "./QuestionItem";
import QuestionItemMenu from "./QuestionItemMenu";
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
  const replyDialogState = React.useState({ open: false, questionId: "" });
  const questionsQueryResult = useQuestionsByEventQuery({
    variables: { input: questionQueryInput },
  });
  const { data, loading, fetchMore } = questionsQueryResult;

  const moreMenuContextQuestion = React.useMemo(
    () =>
      data?.questionsByEvent.list.find(
        (item) => item.id === moreMenuState[0].id
      ),
    [data, moreMenuState]
  );

  useQuestionRealtimeQuerySubscription({
    variables:{where: {eventId: {_eq: "e5126d8f-5b4f-43fc-9c49-dd741d315060"}}},
    // context: { clientName: "hasura" },
  })

  useQuestionRealtimeSearchSubscription({
    skip: !Boolean(data?.questionsByEvent.hash),
    variables: {
      eventId: questionQueryInput.eventId,
      hash: data?.questionsByEvent.hash as string,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.questionRealtimeSearch) {
        if (data) {
          const questionRealtimeSearch =
            subscriptionData.data.questionRealtimeSearch;

          // BUG: should not trigger a field merge
          // https://github.com/apollographql/apollo-client/issues/7491#ref-commit-b62d097
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
      });
    }
  };

  return (
    <React.Fragment>
      <Virtuoso
        style={{ height: "100%", width: "100%" }}
        totalCount={orderedList.length}
        isScrolling={(scrolling) => {
          setIsScrolling(scrolling);
        }}
        endReached={loadMore}
        itemContent={(index) => {
          const question: QuestionFieldsFragment = orderedList[index];

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
              hasNextPage={data?.questionsByEvent.hasNextPage}
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
