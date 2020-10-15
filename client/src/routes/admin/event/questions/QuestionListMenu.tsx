import React from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
import { QueryResult } from "@apollo/client";
import {
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  useDeleteQuestionMutation,
} from "../../../../generated/graphqlHooks";
import Confirm from "../../../../components/Confirm";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import ReplyIcon from "@material-ui/icons/Reply";

interface Props {
  questionsQueryResult: QueryResult<
    QuestionsByEventQuery,
    QuestionsByEventQueryVariables
  >;
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
  handleOpenReply: (id: string) => void;
}

const QuestionListMenu: React.FC<Props> = ({
  questionsQueryResult,
  moreMenuState,
  editContentInputRef,
  editContentIdsState,
  handleOpenReply,
}) => {
  const { formatMessage } = useIntl();
  const { data } = questionsQueryResult;
  const [moreMenu, setMoreMenu] = moreMenuState;
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: "",
  });
  const [deleteQuestionMutation] = useDeleteQuestionMutation();

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
        <MenuItem onClick={() => handleEditContentToggle(moreMenu.id)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Edit",
              defaultMessage: "Edit",
            })}
          />
        </MenuItem>
        <MenuItem onClick={() => handleOpenReply(moreMenu.id)}>
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
        <MenuItem
          disabled={
            (data?.questionsByEvent.list || []).find(
              (question) => question.id === moreMenu.id
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
              defaultMessage: "Delete",
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

export default QuestionListMenu;
