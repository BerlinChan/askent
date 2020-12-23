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
  useQuestionsByMeLazyQuery,
  MeQuery,
  MeQueryVariables,
} from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../constant";
import { useParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import ListFooter from "../ListFooter";
import QuestionItem from "../../routes/event/live/questions/QuestionItem";
import QuestionItemMenu from "../../routes/event/live/questions/QuestionItemMenu";

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
  const [questionsByMeLazyQuery, questionsResult] = useQuestionsByMeLazyQuery({
    variables: {
      eventId: id,
      pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
    },
  });
  const { data, loading, fetchMore } = questionsResult;

  React.useEffect(() => {
    if (open) {
      questionsByMeLazyQuery();
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
    if (data?.questionsByMe.hasNextPage) {
      fetchMore &&
        fetchMore({
          variables: {
            pagination: {
              offset: data?.questionsByMe.list.length || DEFAULT_PAGE_OFFSET,
              limit: data?.questionsByMe.limit || DEFAULT_PAGE_LIMIT,
            },
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, fetchMoreResult, {
              questionsByMe: {
                ...fetchMoreResult.questionsByMe,
                list: [
                  ...prev.questionsByMe.list,
                  ...fetchMoreResult.questionsByMe.list,
                ],
              },
            });
          },
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
            totalCount={data?.questionsByMe.list.length || 0}
            isScrolling={(scrolling) => {
              setIsScrolling(scrolling);
            }}
            endReached={loadMore}
            itemContent={(index) => {
              const question = data?.questionsByMe.list[index];
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
                <ListFooter
                  loading={loading}
                  hasNextPage={data?.questionsByMe.hasNextPage}
                />
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
        questionList={questionsResult.data?.questionsByMe.list}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
      />
    </React.Fragment>
  );
};

export default MyQuestionsDialog;
