import React from "react";
import { Container } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "../Header";

const Layout: React.FC = props => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Header />
        {props.children}
      </Container>
    </React.Fragment>
  );
};

export default Layout;
