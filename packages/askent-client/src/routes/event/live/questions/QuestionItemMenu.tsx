import React from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { QueryResult } from "@apollo/client";
import {
  MeQuery,
  MeQueryVariables,
  useDeleteQuestionMutation,
  ReviewStatus,
} from "../../../../generated/graphqlHooks";
import Confirm from "../../../../components/Confirm";
import EditIcon from "@material-ui/icons/Edit";
import ReplyIcon from "@material-ui/icons/Reply";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  EventDetailLiveQueryFieldsFragment,
  QuestionLiveQueryAudienceFieldsFragment,
} from "../../../../generated/hasuraHooks";
import { ReplyDialogStateType } from "./reply/ReplyDialog";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventDetailData?: EventDetailLiveQueryFieldsFragment;
  question?: QuestionLiveQueryAudienceFieldsFragment;
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
  replyDialogState?: [
    ReplyDialogStateType,
    React.Dispatch<React.SetStateAction<ReplyDialogStateType>>
  ];
}

const QuestionItemMenu: React.FC<Props> = ({
  userQueryResult,
  eventDetailData,
  question,
  moreMenuState,
  editContentInputRef,
  editContentIdsState,
  replyDialogState,
}) => {
  const { formatMessage } = useIntl();
  const [deleteQuestionMutation] = useDeleteQuestionMutation();
  const [moreMenu, setMoreMenu] = moreMenuState;
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: "",
  });

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

  const handleOpenReply = (id: string) => {
    if (replyDialogState) {
      replyDialogState[1]({ open: true, questionId: id });
      handleMoreClose();
    }
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
        {question?.author?.id === userQueryResult.data?.me.id && (
          <MenuItem
            disabled={Boolean(
              question?.top ||
                (eventDetailData?.moderation &&
                  question?.reviewStatus === ReviewStatus.Publish)
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
        )}
        {replyDialogState && (
          <MenuItem
            onClick={() => handleOpenReply(moreMenu.id)}
          >
            <ListItemIcon>
              <ReplyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={formatMessage({
                id: "Reply",
                defaultMessage: "Reply",
              })}
            />
          </MenuItem>
        )}
        {question?.author?.id === userQueryResult.data?.me.id && (
          <MenuItem
            disabled={question?.top}
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
        )}
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

export default QuestionItemMenu;
