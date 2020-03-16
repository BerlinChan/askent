import React from "react";
import { Typography, Fab, Dialog } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";
import { QueryResult } from "@apollo/react-common";
import { MeQuery, MeQueryVariables } from "../../../../generated/graphqlHooks";
import DialogTitleWithClose from "../../../../components/DialogTitleWithClose";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: { width: 600 },
    askFab: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    }
  })
);

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
}

const AskDialog: React.FC<Props> = ({ userQueryResult }) => {
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
    </React.Fragment>
  );
};

export default AskDialog;
