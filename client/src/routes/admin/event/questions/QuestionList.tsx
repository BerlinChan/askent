import React from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  useDeleteQuestionMutation,
  QuestionFieldsFragment,
  QuestionOrder
} from "../../../../generated/graphqlHooks";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Confirm from "../../../../components/Confirm";
import QuestionItem from "./QuestionItem";
import EditIcon from "@material-ui/icons/Edit";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../../constant";
import { sortQuestionBy } from "../../../../utils";

interface Props {
  eventQuery: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  questionsByEventQuery: QueryResult<
    QuestionsByEventQuery,
    QuestionsByEventQueryVariables
  >;
  order?: QuestionOrder;
}

const QuestionList: React.FC<Props> = ({
  eventQuery,
  questionsByEventQuery,
  order = QuestionOrder.Popular
}) => {
  const { formatMessage } = useIntl();
  const { data, fetchMore } = questionsByEventQuery;
  const [moreMenu, setMoreMenu] = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const [deleteQuestionMutation] = useDeleteQuestionMutation();
  const editContentInputRef = React.useRef<HTMLInputElement>(null);

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
  const orderedList = React.useMemo(() => {
    const list = sortQuestionBy<QuestionFieldsFragment>(order)(
      data?.questionsByEvent.list || []
    );

    setEndReached(
      Number(data?.questionsByEvent.list.length) >=
        Number(data?.questionsByEvent.totalCount)
    );

    return list;
  }, [data, order]);
  const loadMore = () => {
    if (!endReached) {
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
        endReached={loadMore}
        item={index => {
          const question = orderedList[index] as
            | QuestionFieldsFragment
            | undefined;
          if (!question) return <div />;
          return (
            <QuestionItem
              question={question}
              eventQuery={eventQuery}
              handleMoreClick={handleMoreClick}
              editContent={editContentIds.includes(question.id)}
              handleEditContentToggle={handleEditContentToggle}
              editContentInputRef={editContentInputRef}
            />
          );
        }}
        footer={() => {
          return endReached ? <div>-- end --</div> : <div>Loading...</div>;
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
        <MenuItem onClick={() => handleEditContentToggle(moreMenu.id)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Edit",
              defaultMessage: "Edit"
            })}
          />
        </MenuItem>
        <MenuItem
          disabled={
            (data?.questionsByEvent.list || []).find(
              question => question.id === moreMenu.id
            )?.top
          }
          onClick={() => handleOpenDelete(moreMenu.id)}
        >
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Delete",
              defaultMessage: "Delete"
            })}
          />
        </MenuItem>
      </Menu>
      <Confirm
        open={deleteConfirm.open}
        contentText={
          <FormattedMessage
            id="Delete_this_question?"
            defaultMessage="Delete this question?"
          />
        }
        okText={<FormattedMessage id="Delete" defaultMessage="Delete" />}
        onCancel={handleCloseDelete}
        onOk={handleDelete}
      />
    </React.Fragment>
  );
};

export default QuestionList;
