import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import DialogTitleWithClose from "../../../../../components/DialogTitleWithClose";
import ReplyList from "./ReplyList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {},
  })
);

type ReplyDialogStateType = {
  open: boolean;
  questionId: string;
};

export interface Props {
  replyDialogState: [
    ReplyDialogStateType,
    React.Dispatch<React.SetStateAction<ReplyDialogStateType>>
  ];
}

const ReplyDialog: React.FC<Props> = ({ replyDialogState }) => {
  const classes = useStyles();
  const [replyDialog, setReplyDialog] = replyDialogState;
  const handleClose = () => {
    setReplyDialog(Object.assign({}, replyDialog, { open: false }));
  };
  const onExited = () => {
    setReplyDialog({ open: false, questionId: "" });
  };

  return (
    <Dialog
      open={replyDialog.open}
      onClose={handleClose}
      onExited={onExited}
      fullWidth
    >
      <DialogTitleWithClose
        title={<FormattedMessage id="Reply" defaultMessage="Reply" />}
        onClose={handleClose}
      />
      <DialogContent className={classes.content}>
        <ReplyList questionId={replyDialog.questionId} />
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
