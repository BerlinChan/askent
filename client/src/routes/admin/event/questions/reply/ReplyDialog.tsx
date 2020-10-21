import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import DialogTitleWithClose from "../../../../../components/DialogTitleWithClose";
import ReplyList from "./ReplyList";

interface Props {
  questionId: string;
  onCancel: () => void;
}

const ReplyDialog: React.FC<Props> = ({ questionId, onCancel }) => {
  return (
    <Dialog open={Boolean(questionId)}>
      <DialogTitleWithClose
        title={<FormattedMessage id="Reply" defaultMessage="Reply" />}
        onClose={onCancel}
      />
      <DialogContent>
        ReplyDialog {questionId}
        <ReplyList questionId={questionId} />
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
