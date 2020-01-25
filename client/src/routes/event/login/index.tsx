import React from "react";
import { Box, Container } from "@material-ui/core";
import { useRouteMatch, useParams } from "react-router-dom";

const EventLogin: React.FC = () => {
  let { path, url } = useRouteMatch();
  let { id } = useParams();

  return (
    <Box>
      <Container maxWidth="lg">
        Event Login
        <div>path: {path}</div>
        <div>url: {url}</div>
        <div>id: {id}</div>
      </Container>
    </Box>
  );
};

export default EventLogin;
