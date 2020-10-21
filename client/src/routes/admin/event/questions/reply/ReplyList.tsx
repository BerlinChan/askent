import React from "react";
import {
  ReplyQueryInput,
  RepliesByQuestionDocument,
  useRepliesByQuestionQuery,
  ReplyFieldsFragment,
  useReplyRealtimeSearchSubscription,
} from "../../../../../generated/graphqlHooks";
import { Virtuoso } from "react-virtuoso";
import ReplyItem from "./ReplyItem";
import ReplyListMenu from "./ReplyListMenu";
import ListFooter from "../../../../../components/ListFooter";
import {
  DEFAULT_PAGE_OFFSET,
  DEFAULT_PAGE_LIMIT,
} from "../../../../../constant";

interface Props {
  questionId: string;
}

const ReplyList: React.FC<Props> = ({ questionId }) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);
  const replyQueryInput: ReplyQueryInput = {
    questionId,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
  };
  const repliesQueryResult = useRepliesByQuestionQuery({
    fetchPolicy: "network-only",
    variables: { input: replyQueryInput },
  });
  const { data, loading, fetchMore } = repliesQueryResult;

  useReplyRealtimeSearchSubscription({
    variables: {
      questionId: replyQueryInput.questionId,
      hash: data?.repliesByQuestion.hash as string,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.replyRealtimeSearch) {
        const replyRealtimeSearch = subscriptionData.data.replyRealtimeSearch;

        if (data) {
          client.writeQuery({
            query: RepliesByQuestionDocument,
            variables: { input: replyQueryInput },
            data: {
              repliesByQuestion: {
                ...data.repliesByQuestion,
                totalCount: replyRealtimeSearch.totalCount,
                list: data.repliesByQuestion.list
                  // remove
                  .filter(
                    (preQuestion) =>
                      !replyRealtimeSearch.deleteList.includes(
                        preQuestion.id
                      ) &&
                      !replyRealtimeSearch.updateList
                        .map((item) => item.id)
                        .includes(preQuestion.id)
                  )
                  // add
                  .concat(replyRealtimeSearch.insertList)
                  .concat(replyRealtimeSearch.updateList),
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

  const loadMore = () => {
    if (data?.repliesByQuestion.hasNextPage) {
      fetchMore({
        variables: {
          input: {
            ...replyQueryInput,
            pagination: {
              offset:
                data?.repliesByQuestion.list.length || DEFAULT_PAGE_OFFSET,
              limit: data?.repliesByQuestion.limit || DEFAULT_PAGE_LIMIT,
            },
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            repliesByQuestion: {
              ...fetchMoreResult.repliesByQuestion,
              list: [
                ...prev.repliesByQuestion.list,
                ...fetchMoreResult.repliesByQuestion.list,
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
        style={{ height: "300px", width: "100%" }}
        totalCount={data?.repliesByQuestion.list.length || 0}
        scrollingStateChange={(scrolling) => {
          setIsScrolling(scrolling);
        }}
        endReached={loadMore}
        item={(index) => {
          const reply: ReplyFieldsFragment | undefined =
            data?.repliesByQuestion.list[index];
          if (!reply) return <div />;

          return (
            <ReplyItem
              reply={reply}
              handleMoreClick={handleMoreOpen}
              editContent={editContentIdsState[0].includes(reply.id)}
              handleEditContentToggle={handleEditContentToggle}
              editContentInputRef={editContentInputRef}
              isScrolling={isScrolling}
            />
          );
        }}
        footer={() => (
          <ListFooter
            loading={loading}
            hasNextPage={data?.repliesByQuestion.hasNextPage}
          />
        )}
      />

      <ReplyListMenu
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
      />
    </React.Fragment>
  );
};

export default ReplyList;
