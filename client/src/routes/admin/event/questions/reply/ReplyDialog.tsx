import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import DialogTitleWithClose from "../../../../../components/DialogTitleWithClose";
import ReplyList from "./ReplyList";

interface Props {
  replyQuestionIdState: [string, React.Dispatch<React.SetStateAction<string>>];
}

const ReplyDialog: React.FC<Props> = ({ replyQuestionIdState }) => {
  const [replyQuestionId, setReplyQuestionId] = replyQuestionIdState;
  const handleCancel = () => {
    setReplyQuestionId("");
  };

  return (
    <Dialog open={Boolean(replyQuestionId)} onClose={handleCancel} fullWidth>
      <DialogTitleWithClose
        title={<FormattedMessage id="Reply" defaultMessage="Reply" />}
        onClose={handleCancel}
      />
      <DialogContent>
        ReplyDialog {replyQuestionId}
        <ReplyList questionId={replyQuestionId} />
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
