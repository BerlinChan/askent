import React from "react";
import {
  Typography,
  Fab,
  Dialog,
  Hidden,
  Slide,
  AppBar,
  Toolbar,
  IconButton
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";
import { QueryResult } from "@apollo/react-common";
import { MeQuery, MeQueryVariables } from "../../../../generated/graphqlHooks";
import DialogTitleWithClose from "../../../../components/DialogTitleWithClose";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: { width: 600 },
    askFab: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    },
    toolbarTitle: { marginLeft: theme.spacing(2) }
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
}

const AskFabDialog: React.FC<Props> = ({ userQueryResult }) => {
  const classes = useStyles();
  const [openAskDialog, setOpenAskDialog] = React.useState(false);

  const handleAskOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpenAskDialog(true);
  };
  const handleAskClose = () => {
    setOpenAskDialog(false);
  };

  return (
    <React.Fragment>
      <Fab className={classes.askFab} color="secondary" onClick={handleAskOpen}>
        <Typography variant="subtitle1" color="inherit">
          <FormattedMessage id="Ask" defaultMessage="Ask" />
        </Typography>
      </Fab>

      <Hidden smDown>
        <Dialog
          classes={{ paper: classes.paper }}
          open={openAskDialog}
          onClose={handleAskClose}
        >
          <DialogTitleWithClose
            title={
              <FormattedMessage
                id="Ask the speaker"
                defaultMessage="Ask the speaker"
              />
            }
            onClose={handleAskClose}
          />
          <QuestionForm
            autoFocus
            userQueryResult={userQueryResult}
            onAfterSubmit={handleAskClose}
          />
        </Dialog>
      </Hidden>

      <Hidden mdUp>
        <Dialog
          fullScreen
          open={openAskDialog}
          onClose={handleAskClose}
          TransitionComponent={Transition}
        >
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleAskClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.toolbarTitle}>
                <FormattedMessage
                  id="Ask the speaker"
                  defaultMessage="Ask the speaker"
                />
              </Typography>
            </Toolbar>
          </AppBar>
          <QuestionForm
            autoFocus
            userQueryResult={userQueryResult}
            onAfterSubmit={handleAskClose}
          />
        </Dialog>
      </Hidden>
    </React.Fragment>
  );
};

export default AskFabDialog;