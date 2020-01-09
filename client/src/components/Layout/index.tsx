import React from "react";
import { Container } from "@material-ui/core";
import Header from "../Header";

const Layout: React.FC = props => {
  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Header />
        {props.children}
      </Container>
    </React.Fragment>
  );
};

export default Layout;
