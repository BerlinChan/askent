import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
// import {} from "../../../../generated/graphqlHooks";
import DialogTitleWithClose from "../../../../components/DialogTitleWithClose";

interface Props {
  questionId: string;
  onCancel: () => void;
}

const ReplyDialog: React.FC<Props> = ({ questionId, onCancel }) => {
  const { formatMessage } = useIntl();

  React.useEffect(() => {
    if (questionId) {
    }
  }, [questionId]);

  return (
    <Dialog open={Boolean(questionId)}>
      <DialogTitleWithClose
        title={<FormattedMessage id="Reply" defaultMessage="Reply" />}
        onClose={onCancel}
      />
      <DialogContent>ReplyDialog {questionId}</DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
