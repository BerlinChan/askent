import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: { marginLeft: theme.spacing(1) }
  })
);

const UnauthAction = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Link color="inherit" component={RouterLink} to="/login">
        Log In
      </Link>
      <Link
        color="inherit"
        component={RouterLink}
        className={classes.link}
        to="/signup"
      >
        Sign Up
      </Link>
    </React.Fragment>
  );
};

export default UnauthAction;
