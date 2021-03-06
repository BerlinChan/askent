import React from "react";
import { QueryResult } from "@apollo/client";
import {
  useReplyLiveQueryAudienceSubscription,
  ReplyLiveQueryFieldsFragment,
  ReplyLiveQueryAudienceSubscriptionVariables,
  Order_By,
  EventDetailLiveQueryFieldsFragment,
  QuestionLiveQueryAudienceFieldsFragment,
} from "../../../../../generated/hasuraHooks";
import {
  MeQuery,
  MeQueryVariables,
} from "../../../../../generated/graphqlHooks";
import { Virtuoso } from "react-virtuoso";
import ReplyItem from "./ReplyItem";
import ReplyListHeader from "./ReplyListHeader";
import ReplyListMenu from "./ReplyListMenu";
import ListFooter from "../../../../../components/ListFooter";
import {
  DEFAULT_PAGE_OFFSET,
  DEFAULT_PAGE_LIMIT,
} from "../../../../../constant";
import { getHasNextPage } from "../../../../../utils";

interface Props {
  questionId: string;
  eventDetailData: EventDetailLiveQueryFieldsFragment | undefined;
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
}

const ReplyList: React.FC<Props> = ({ questionId, eventDetailData,userQueryResult }) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);
  const [
    replyLiveQueryInput,
    setReplyLiveQueryInput,
  ] = React.useState<ReplyLiveQueryAudienceSubscriptionVariables>({
    questionId,
    limit: DEFAULT_PAGE_LIMIT,
    offset: DEFAULT_PAGE_OFFSET,
    order_by: { createdAt: Order_By.Desc },
  });
  const [loading, setLoading] = React.useState(true);
  const [
    questionLiveQueryData,
    setQuestionLiveQueryData,
  ] = React.useState<QuestionLiveQueryAudienceFieldsFragment>();
  const [replyLiveQueryData, setReplyLiveQueryData] = React.useState<
    ReplyLiveQueryFieldsFragment[]
  >([]);

  useReplyLiveQueryAudienceSubscription({
    variables: replyLiveQueryInput,
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.question.length) {
        setQuestionLiveQueryData(subscriptionData.data?.question[0]);
        setReplyLiveQueryData(subscriptionData.data?.question[0].replies);
      }
      setLoading(false);
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
      replyLiveQueryInput.offset + replyLiveQueryInput.limit <
      (questionLiveQueryData?.replyCount || 0)
    ) {
      setLoading(true);
      setReplyLiveQueryInput({
        ...replyLiveQueryInput,
        limit: replyLiveQueryInput.limit * 2,
      });
    }
  };

  return (
    <React.Fragment>
      <Virtuoso
        style={{ height: "100%", width: "100%", minHeight: 300 }}
        totalCount={replyLiveQueryData.length}
        isScrolling={(scrolling) => {
          setIsScrolling(scrolling);
        }}
        endReached={loadMore}
        itemContent={(index) => {
          const reply: ReplyLiveQueryFieldsFragment = replyLiveQueryData[index];

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
        components={{
          Header: () => (
            <ReplyListHeader
              loading={loading}
              isScrolling={isScrolling}
              question={questionLiveQueryData}
              eventDetailData={eventDetailData}
              userQueryResult={userQueryResult}
            />
          ),
          Footer: () => (
            <ListFooter
              loading={loading}
              hasNextPage={getHasNextPage(
                replyLiveQueryInput.offset,
                replyLiveQueryInput.limit,
                questionLiveQueryData?.replyCount || 0
              )}
            />
          ),
        }}
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
