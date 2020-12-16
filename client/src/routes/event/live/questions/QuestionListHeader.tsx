import React from "react";
import { Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(1),
      marginDown: theme.spacing(1),
    },
    questionForm: { marginBottom: theme.spacing(2) },
  })
);

interface Props {}

const QuestionListHeader: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        className={classes.title}
      >
        <FormattedMessage
          id="Ask_the_speaker"
          defaultMessage="Ask the speaker"
        />
      </Typography>
      <QuestionForm
        className={classes.questionForm}
        onFocus={() => {
          document.querySelector(".scrollContainer")?.scrollTo(0, 0);
        }}
      />
    </React.Fragment>
  );
};

export default QuestionListHeader;
