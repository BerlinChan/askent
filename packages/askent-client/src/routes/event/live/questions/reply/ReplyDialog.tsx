import React from "react";
import { QueryResult } from "@apollo/client";
import { Dialog, DialogContent } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import DialogTitleWithClose from "../../../../../components/DialogTitleWithClose";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
import { EventDetailLiveQueryFieldsFragment } from "../../../../../generated/hasuraHooks";
import {
  MeQuery,
  MeQueryVariables,
} from "../../../../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {},
    form: { marginTop: theme.spacing(1) },
  })
);

export type ReplyDialogStateType = {
  open: boolean;
  questionId: string;
};

export interface Props {
  replyDialogState: [
    ReplyDialogStateType,
    React.Dispatch<React.SetStateAction<ReplyDialogStateType>>
  ];
  eventDetailData:EventDetailLiveQueryFieldsFragment|undefined;
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
}

const ReplyDialog: React.FC<Props> = ({
  replyDialogState,
  eventDetailData,
  userQueryResult
}) => {
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
      scroll={"body"}
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
        <ReplyList
          questionId={replyDialog.questionId}
          eventDetailData={eventDetailData}
          userQueryResult={userQueryResult}
          />
        <ReplyForm
          className={classes.form}
          questionId={replyDialog.questionId}
          autoFocus
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
