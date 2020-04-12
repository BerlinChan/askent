import React from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionAudienceFieldsFragment,
  useDeleteQuestionMutation,
  ReviewStatus,
} from "../../../../generated/graphqlHooks";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Confirm from "../../../../components/Confirm";
import EditIcon from "@material-ui/icons/Edit";

interface Props {
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  questionList: QuestionAudienceFieldsFragment[] | undefined;
  moreMenuState: [
    {
      anchorEl: HTMLElement | null;
      id: string;
    },
    React.Dispatch<
      React.SetStateAction<{
        anchorEl: HTMLElement | null;
        id: string;
      }>
    >
  ];
  editContentInputRef: React.RefObject<HTMLInputElement>;
  editContentIdsState: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ];
}

const QuestionListMenu: React.FC<Props> = ({
  eventQueryResult,
  questionList = [],
  moreMenuState,
  editContentInputRef,
  editContentIdsState,
}) => {
  const { formatMessage } = useIntl();
  const [deleteQuestionMutation] = useDeleteQuestionMutation();
  const [moreMenu, setMoreMenu] = moreMenuState;
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: "",
  });
  const questionMoreTarget = questionList.find(
    (question) => question.id === moreMenu.id
  );

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
      variables: { questionId: deleteConfirm.id },
    });
    handleCloseDelete();
  };
  const [editContentIds, setEditContentIds] = editContentIdsState;
  const handleEditContentToggle = (id: string) => {
    const findId = editContentIds.find((item) => item === id);
    setEditContentIds(
      findId
        ? editContentIds.filter((item) => item !== id)
        : editContentIds.concat([id])
    );
    handleMoreClose();
    setTimeout(() => editContentInputRef.current?.focus(), 100);
  };

  return (
    <React.Fragment>
      <Menu
        MenuListProps={{ dense: true }}
        anchorEl={moreMenu.anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(moreMenu.anchorEl)}
        onClose={handleMoreClose}
      >
        <MenuItem
          disabled={Boolean(
            questionMoreTarget?.top ||
              (eventQueryResult.data?.eventById.moderation &&
                questionMoreTarget?.reviewStatus === ReviewStatus.Publish)
          )}
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
              defaultMessage: "Withdraw",
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

export default QuestionListMenu;
