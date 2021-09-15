import React from "react";
import { QueryResult } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Hidden,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Close as CloseIcon } from "@material-ui/icons";
import { FormattedMessage } from "react-intl";
import DialogTitleWithClose from "../../../../../components/DialogTitleWithClose";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
import { EventDetailLiveQueryFieldsFragment } from "../../../../../generated/hasuraHooks";
import {
  MeQuery,
  MeQueryVariables,
} from "../../../../../generated/graphqlHooks";
import SlideUpFullScreen from "../../../../../components/Transition/SlideUpFullScreen";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {},
    form: { marginTop: theme.spacing(1) },

    appBar: {
      position: "relative",
    },
    appBarTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
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
  eventDetailData?: EventDetailLiveQueryFieldsFragment;
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
}

const ReplyDialog: React.FC<Props> = ({
  replyDialogState,
  eventDetailData,
  userQueryResult,
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
    <React.Fragment>
      <Hidden smDown>
        <Dialog
          scroll={"body"}
          open={replyDialog.open}
          onClose={handleClose}
          TransitionProps={{onExited}}
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
      </Hidden>

      <Hidden mdUp>
        <Dialog
          fullScreen
          open={replyDialog.open}
          onClose={handleClose}
          TransitionProps={{onExited}}
          TransitionComponent={SlideUpFullScreen}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.appBarTitle}>
                <FormattedMessage id="Reply" defaultMessage="Reply" />
              </Typography>
            </Toolbar>
          </AppBar>
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
        </Dialog>
      </Hidden>
    </React.Fragment>
  );
};

export default ReplyDialog;
