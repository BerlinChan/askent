import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { QueryResult } from "@apollo/client";
import {
  useEventByIdLazyQuery,
  MeQuery,
  MeQueryVariables,
  QuestionFilter,
} from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../constant";
import { useParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import ListFooter from "../ListFooter";
import QuestionItem from "../../routes/event/live/questions/QuestionItem";
import QuestionItemMenu from "../../routes/event/live/questions/QuestionItemMenu";
import {
  QuestionLiveQueryAudienceFieldsFragment,
  useQuestionCountLiveQueryAudienceSubscription,
  useQuestionLiveQueryAudienceSubscription,
} from "../../generated/hasuraHooks";
import { getHasNextPage } from "../../utils";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  open: boolean;
  onClose: () => void;
}

const MyQuestionsDialog: React.FC<Props> = ({
  userQueryResult,
  open,
  onClose,
}) => {
  const { id } = useParams<{ id: string }>();
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);
  const [eventByIdLazyQuery, eventByIdQueryResult] = useEventByIdLazyQuery({
    variables: { eventId: id },
  });

  const [questionQueryState, setQuestionQueryState] = React.useState({
    limit: DEFAULT_PAGE_LIMIT,
    offset: DEFAULT_PAGE_OFFSET,
  });
  const [questionLiveQueryData, setQuestionLiveQueryData] = React.useState<
    QuestionLiveQueryAudienceFieldsFragment[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [questionLiveQueryCount, setQuestionLiveQueryCount] = React.useState(0);
  const hasNextPage = getHasNextPage(
    questionQueryState.offset,
    questionQueryState.limit,
    questionLiveQueryCount
  );

  useQuestionLiveQueryAudienceSubscription({
    skip: !open,
    variables: {
      userId: userQueryResult.data?.me.id,
      where: {
        eventId: { _eq: id },
        reviewStatus: { _eq: QuestionFilter.Publish },
      },
      limit: questionQueryState.limit,
      offset: questionQueryState.offset,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.question) {
        setQuestionLiveQueryData(subscriptionData.data?.question);
        setLoading(false);
      }
    },
  });

  useQuestionCountLiveQueryAudienceSubscription({
    skip: !open,
    variables: { where: { eventId: { _eq: id } } },
    onSubscriptionData: ({ client, subscriptionData }) => {
      setQuestionLiveQueryCount(
        subscriptionData.data?.question_aggregate.aggregate?.count || 0
      );
    },
  });

  React.useEffect(() => {
    if (open) {
      eventByIdLazyQuery();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleMoreClick = (
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
      setLoading(true);
      setQuestionQueryState({
        ...questionQueryState,
        limit: questionQueryState.limit * 2,
      });
    }
  };

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <DialogTitle>
          <FormattedMessage id="My_questions" defaultMessage="My questions" />
        </DialogTitle>
        <DialogContent style={{ height: 500 }}>
          <Virtuoso
            className="scrollContainer"
            style={{ height: "100%", width: "100%" }}
            totalCount={questionLiveQueryCount}
            isScrolling={(scrolling) => {
              setIsScrolling(scrolling);
            }}
            endReached={loadMore}
            itemContent={(index) => {
              const question = questionLiveQueryData[index];
              if (!question) return <div />;

              return (
                <QuestionItem
                  disableVote
                  disableItemShadow
                  question={question}
                  userQueryResult={userQueryResult}
                  handleMoreClick={handleMoreClick}
                  editContent={editContentIdsState[0].includes(question.id)}
                  handleEditContentToggle={handleEditContentToggle}
                  editContentInputRef={editContentInputRef}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="Close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </Dialog>

      <QuestionItemMenu
        eventQueryResult={eventByIdQueryResult}
        questionList={questionLiveQueryData}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
      />
    </React.Fragment>
  );
};

export default MyQuestionsDialog;
