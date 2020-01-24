import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";

export const UnauthAction = () => {
  return (
    <React.Fragment>
      <Link color="inherit" component={RouterLink} to="/login">
        Log In
      </Link>
      <Link color="inherit" component={RouterLink} to="/signup">
        Sign Up
      </Link>
    </React.Fragment>
  );
};
