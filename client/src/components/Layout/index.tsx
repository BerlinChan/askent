import React from "react";
import { Container } from "@material-ui/core";

const Layout: React.FC = props => {
  return (
    <React.Fragment>
      <Container maxWidth="md">{props.children}</Container>
    </React.Fragment>
  );
};

export default Layout;
