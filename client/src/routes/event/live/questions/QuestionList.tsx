import React from "react";
import * as R from "ramda";
import {
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  LiveQuestionsByEventQuery,
  LiveQuestionsByEventQueryVariables,
  useDeleteQuestionMutation,
  LiveQuestionFieldsFragment,
  QuestionReviewStatus
} from "../../../../generated/graphqlHooks";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Confirm from "../../../../components/Confirm";
import EditIcon from "@material-ui/icons/Edit";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../../constant";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  liveQuestionsResult: QueryResult<
    LiveQuestionsByEventQuery,
    LiveQuestionsByEventQueryVariables
  >;
  sortComparator?: R.Comparator<LiveQuestionFieldsFragment, number>[];
}

const QuestionList: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult,
  liveQuestionsResult,
  sortComparator = []
}) => {
  const { formatMessage } = useIntl();
  const { data, fetchMore } = liveQuestionsResult;
  const [deleteQuestionMutation] = useDeleteQuestionMutation();
  const [moreMenu, setMoreMenu] = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const questionMoreTarget = data?.liveQuestionsByEvent.list.find(
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
  const [editContentIds, setEditContentIds] = React.useState<Array<string>>([]);
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

  const [endReached, setEndReached] = React.useState(false);
  const orderList = React.useMemo(() => {
    const list = R.sortWith([
      R.descend<LiveQuestionFieldsFragment>(R.prop("top")),
      ...sortComparator
    ])(data?.liveQuestionsByEvent.list || []);

    setEndReached(
      Number(data?.liveQuestionsByEvent.list.length) >=
        Number(data?.liveQuestionsByEvent.totalCount)
    );

    return list;
  }, [data, sortComparator]);
  const loadMore = () => {
    if (!endReached) {
      fetchMore({
        variables: {
          pagination: {
            offset: data?.liveQuestionsByEvent.list.length || DEFAULT_PAGE_OFFSET,
            limit: data?.liveQuestionsByEvent.limit || DEFAULT_PAGE_LIMIT
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, fetchMoreResult, {
            questionsByEvent: {
              ...fetchMoreResult.liveQuestionsByEvent,
              list: [
                ...prev.liveQuestionsByEvent.list,
                ...fetchMoreResult.liveQuestionsByEvent.list
              ]
            }
          });
        }
      });
    }
  };

  return (
    <React.Fragment>
      {0 ? (
        <Virtuoso
          style={{ height: "100%", width: "100%" }}
          totalCount={orderList.length}
          endReached={loadMore}
          item={index => {
            return (
              <QuestionItem
                question={orderList[index]}
                userQueryResult={userQueryResult}
                handleMoreClick={handleMoreClick}
                editContent={editContentIds.includes(orderList[index].id)}
                handleEditContentToggle={handleEditContentToggle}
                editContentInputRef={editContentInputRef}
              />
            );
          }}
          footer={() => {
            return endReached ? <div>-- end --</div> : <div>Loading...</div>;
          }}
        />
      ) : (
        <List disablePadding>
          {orderList.map((item, index) => (
            <QuestionItem
              key={index}
              question={item}
              userQueryResult={userQueryResult}
              handleMoreClick={handleMoreClick}
              editContent={editContentIds.includes(item.id)}
              handleEditContentToggle={handleEditContentToggle}
              editContentInputRef={editContentInputRef}
            />
          ))}
        </List>
      )}

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
              questionMoreTarget?.reviewStatus === QuestionReviewStatus.Publish)
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
};

export default QuestionList;
