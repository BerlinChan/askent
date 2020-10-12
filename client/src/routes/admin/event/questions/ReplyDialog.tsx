import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
import DialogTitleWithClose from "../../../../components/DialogTitleWithClose";

interface Props {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const ReplyDialog: React.FC<Props> = ({ openState }) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = openState;

  return (
    <Dialog open={open}>
      <DialogTitleWithClose
        title={<FormattedMessage id="Reply" defaultMessage="Reply" />}
        onClose={() => {}}
      />
      <DialogContent>ReplyDialog</DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
