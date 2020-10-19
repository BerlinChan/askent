import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
import { useRepliesByQuestionLazyQuery } from "../../../../../generated/graphqlHooks";
import DialogTitleWithClose from "../../../../../components/DialogTitleWithClose";
import ReplyList from "./ReplyList";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../../constant";

interface Props {
  questionId: string;
  onCancel: () => void;
}

const ReplyDialog: React.FC<Props> = ({ questionId, onCancel }) => {
  const { formatMessage } = useIntl();
  const replyQueryInput = {
    questionId,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
  };


  return (
    <Dialog open={Boolean(questionId)}>
      <DialogTitleWithClose
        title={<FormattedMessage id="Reply" defaultMessage="Reply" />}
        onClose={onCancel}
      />
      <DialogContent>
        ReplyDialog {questionId}
        <ReplyList />
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
