import React from "react";
import { Container } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "../Header";

const Layout: React.FC = props => {
  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <CssBaseline />
        <Header />
        {props.children}
      </Container>
    </React.Fragment>
  );
};

export default Layout;
