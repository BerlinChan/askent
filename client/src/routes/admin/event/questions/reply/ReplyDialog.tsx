import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import DialogTitleWithClose from "../../../../../components/DialogTitleWithClose";
import ReplyList from "./ReplyList";

export interface Props {
  replyDialogState: [
    {
      open: boolean;
      questionId: string;
    },
    React.Dispatch<
      React.SetStateAction<{
        open: boolean;
        questionId: string;
      }>
    >
  ];
}

const ReplyDialog: React.FC<Props> = ({ replyDialogState }) => {
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
      <DialogContent>
        ReplyDialog {replyDialog.questionId}
        {replyDialog.questionId ? (
          <ReplyList questionId={replyDialog.questionId} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
