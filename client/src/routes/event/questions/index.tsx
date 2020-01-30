import React from "react";
import { Box, Typography, Container } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const LiveQuestions: React.FC = () => {
  let { id } = useParams();

  return (
    <Container maxWidth="md">
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        <FormattedMessage
          id="Ask_the_speaker"
          defaultMessage="Ask the speaker"
        />
      </Typography>
      <Box>{id}</Box>
    </Container>
  );
};

export default LiveQuestions;
