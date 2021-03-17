import React from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
import { useDeleteReplyMutation } from "../../../../../generated/graphqlHooks";
import Confirm from "../../../../../components/Confirm";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";

type MoreMenuStateType = {
  anchorEl: HTMLElement | null;
  id: string;
};

interface Props {
  moreMenuState: [
    MoreMenuStateType,
    React.Dispatch<React.SetStateAction<MoreMenuStateType>>
  ];
  editContentInputRef: React.RefObject<HTMLInputElement>;
  editContentIdsState: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ];
}

const ReplyListMenu: React.FC<Props> = ({
  moreMenuState,
  editContentInputRef,
  editContentIdsState,
}) => {
  const { formatMessage } = useIntl();
  const [moreMenu, setMoreMenu] = moreMenuState;
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: "",
  });
  const [deleteReplyMutation] = useDeleteReplyMutation();

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
    await deleteReplyMutation({
      variables: { replyId: deleteConfirm.id },
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
        <MenuItem onClick={() => handleOpenDelete(moreMenu.id)}>
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
        contentText={<FormattedMessage id="Delete this reply?" defaultMessage="Delete this reply?" />}
        okText={<FormattedMessage id="Delete" defaultMessage="Delete" />}
        onCancel={handleCloseDelete}
        onOk={handleDelete}
      />
    </React.Fragment>
  );
};

export default ReplyListMenu;
