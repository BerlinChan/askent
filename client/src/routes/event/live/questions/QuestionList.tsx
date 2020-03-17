import React from "react";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Container
} from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionsByEventAudienceQuery,
  QuestionsByEventAudienceQueryVariables,
  useDeleteQuestionMutation,
  QuestionAudienceFieldsFragment,
  ReviewStatus,
  QuestionOrder
} from "../../../../generated/graphqlHooks";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Confirm from "../../../../components/Confirm";
import EditIcon from "@material-ui/icons/Edit";
import QuestionItem from "./QuestionItem";
import { Virtuoso, VirtuosoMethods, TScrollContainer } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../../constant";
import { sortQuestionBy } from "../../../../utils";

const ScrollContainer: TScrollContainer = ({
  className,
  style,
  reportScrollTop,
  scrollTo,
  children
}) => {
  const elRef = React.useRef<HTMLDivElement>(null);

  // 自定 scrollTo，防止回到顶部失败 bug，Doc. https://virtuoso.dev/custom-scroll-container/
  scrollTo(scrollTop => {
    elRef.current?.scrollTo({ top: 0 });
  });

  return (
    <div
      ref={elRef}
      onScroll={e => reportScrollTop(e.currentTarget.scrollTop)}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  questionsQueryResult: QueryResult<
    QuestionsByEventAudienceQuery,
    QuestionsByEventAudienceQueryVariables
  >;
  order?: QuestionOrder;
  header?: React.ReactElement;
}

const QuestionList: React.ForwardRefExoticComponent<Props &
  React.RefAttributes<VirtuosoMethods>> = React.forwardRef(
  (
    {
      userQueryResult,
      eventQueryResult,
      questionsQueryResult,
      order = QuestionOrder.Popular,
      header = <div />
    },
    ref
  ) => {
    const { formatMessage } = useIntl();
    const { data, fetchMore } = questionsQueryResult;
    const [deleteQuestionMutation] = useDeleteQuestionMutation();
    const [isScrolling, setIsScrolling] = React.useState(false);
    const [moreMenu, setMoreMenu] = React.useState<{
      anchorEl: null | HTMLElement;
      id: string;
    }>({ anchorEl: null, id: "" });
    const [deleteConfirm, setDeleteConfirm] = React.useState({
      open: false,
      id: ""
    });
    const editContentInputRef = React.useRef<HTMLInputElement>(null);
    const questionMoreTarget = data?.questionsByEventAudience.list.find(
      question => question.id === moreMenu.id
    );

    const handleMoreClick = (
      event: React.MouseEvent<HTMLButtonElement>,
      id: string
    ) => {
      setMoreMenu({ anchorEl: event.currentTarget, id });
    };
    const handleMoreClose = () => {
      setMoreMenu({ anchorEl: null, id: "" });
    };

    const handleOpenDelete = (id: string) => {
      setDeleteConfirm({ open: true, id });
      handleMoreClose();
    };
    const handleCloseDelete = () => {
      setDeleteConfirm({ open: false, id: "" });
      handleMoreClose();
    };
    const handleDelete = async () => {
      await deleteQuestionMutation({
        variables: { questionId: deleteConfirm.id }
      });
      handleCloseDelete();
    };
    const [editContentIds, setEditContentIds] = React.useState<Array<string>>(
      []
    );
    const handleEditContentToggle = (id: string) => {
      const findId = editContentIds.find(item => item === id);
      setEditContentIds(
        findId
          ? editContentIds.filter(item => item !== id)
          : editContentIds.concat([id])
      );
      handleMoreClose();
      setTimeout(() => editContentInputRef.current?.focus(), 100);
    };

    const orderedList = React.useMemo(() => {
      const list = sortQuestionBy<QuestionAudienceFieldsFragment>(order)(
        data?.questionsByEventAudience.list || []
      );

      return list;
    }, [data, order]);
    const loadMore = () => {
      if (data?.questionsByEventAudience.hasNextPage) {
        fetchMore({
          variables: {
            pagination: {
              offset:
                data?.questionsByEventAudience.list.length ||
                DEFAULT_PAGE_OFFSET,
              limit: data?.questionsByEventAudience.limit || DEFAULT_PAGE_LIMIT
            }
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, fetchMoreResult, {
              questionsByEvent: {
                ...fetchMoreResult.questionsByEventAudience,
                list: [
                  ...prev.questionsByEventAudience.list,
                  ...fetchMoreResult.questionsByEventAudience.list
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
          ref={ref}
          ScrollContainer={ScrollContainer}
          style={{ height: "100%", width: "100%" }}
          totalCount={orderedList.length + 1}
          scrollingStateChange={scrolling => {
            setIsScrolling(scrolling);
          }}
          endReached={loadMore}
          item={index => {
            let question: QuestionAudienceFieldsFragment;
            if (index === 0) {
              return <Container maxWidth="sm">{header}</Container>;
            } else if (!orderedList[index - 1]) {
              return <div />;
            } else {
              question = orderedList[index - 1];
            }

            return (
              <QuestionItem
                question={question}
                userQueryResult={userQueryResult}
                handleMoreClick={handleMoreClick}
                editContent={editContentIds.includes(question.id)}
                handleEditContentToggle={handleEditContentToggle}
                editContentInputRef={editContentInputRef}
                isScrolling={isScrolling}
              />
            );
          }}
          footer={() => {
            return (
              <Container maxWidth="sm">
                {!data?.questionsByEventAudience.hasNextPage ? (
                  <div>-- end --</div>
                ) : (
                  <div>Loading...</div>
                )}
              </Container>
            );
          }}
        />

        <Menu
          MenuListProps={{ dense: true }}
          anchorEl={moreMenu.anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={Boolean(moreMenu.anchorEl)}
          onClose={handleMoreClose}
        >
          <MenuItem
            disabled={
              questionMoreTarget?.top ||
              (eventQueryResult.data?.eventById.moderation &&
                questionMoreTarget?.reviewStatus === ReviewStatus.Publish)
            }
            onClick={() => handleEditContentToggle(moreMenu.id)}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={formatMessage({ id: "Edit", defaultMessage: "Edit" })}
            />
          </MenuItem>
          <MenuItem
            disabled={questionMoreTarget?.top}
            onClick={() => handleOpenDelete(moreMenu.id)}
          >
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={formatMessage({
                id: "Withdraw",
                defaultMessage: "Withdraw"
              })}
            />
          </MenuItem>
        </Menu>
        <Confirm
          open={deleteConfirm.open}
          contentText={
            <FormattedMessage
              id="Withdraw_this_question?"
              defaultMessage="Withdraw this question?"
            />
          }
          okText={<FormattedMessage id="Withdraw" defaultMessage="Withdraw" />}
          onCancel={handleCloseDelete}
          onOk={handleDelete}
        />
      </React.Fragment>
    );
  }
);

export default QuestionList;
