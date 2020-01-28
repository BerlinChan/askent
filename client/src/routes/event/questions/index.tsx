import React from "react";
import { Box } from "@material-ui/core";
import { useParams } from "react-router-dom";

const EventQuestions: React.FC = () => {
  let { id } = useParams();

  return (
    <Box>
      Live Question
      <div>{id}</div>
    </Box>
  );
};

export default EventQuestions;
