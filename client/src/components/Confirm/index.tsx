import React, { MouseEventHandler } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import { ButtonLoading } from "../Form";
import { FormattedMessage } from "react-intl";

interface Props {
  open: boolean;
  loading?: boolean;
  title?: React.ReactElement | string;
  contentText?: React.ReactElement | string;
  cancelText?: React.ReactElement | string;
  okText?: React.ReactElement | string;
  onCancel: MouseEventHandler;
  onOk: MouseEventHandler;
}

const Confirm: React.FC<Props> = ({
  open,
  title,
  contentText,
  cancelText,
  okText,
  onCancel,
  onOk,
  loading = false
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {contentText && (
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onCancel} color="default">
          {cancelText ? (
            cancelText
          ) : (
            <FormattedMessage id="Cancel" defaultMessage="Cancel" />
          )}
        </Button>
        <ButtonLoading
          onClick={onOk}
          color="primary"
          loading={loading}
          autoFocus
        >
          {okText ? (
            okText
          ) : (
            <FormattedMessage id="Confirm" defaultMessage="Confirm" />
          )}
        </ButtonLoading>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
