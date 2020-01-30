import React from "react";
import { Box, Typography, Container } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: { marginBottom: 1 }
  })
);

const LiveQuestions: React.FC = () => {
  const classes = useStyles();
  let { id } = useParams();

  return (
    <Container maxWidth="md">
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        <FormattedMessage
          id="Ask_the_speaker"
          defaultMessage="Ask the speaker"
        />
      </Typography>
      <Box className={classes.list}>{id}</Box>
      <QuestionForm />
    </Container>
  );
};

export default LiveQuestions;
