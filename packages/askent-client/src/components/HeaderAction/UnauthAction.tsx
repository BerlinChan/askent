import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles<Theme, {}, string>((theme: Theme) => ({
    link: { marginLeft: theme.spacing(1) },
  }));
const UnauthAction = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Link
        color="inherit"
        component={RouterLink}
        className={classes.link}
        to="/login"
      >
        <FormattedMessage id="Log In" defaultMessage="Log In" />
      </Link>
      <Link
        color="inherit"
        component={RouterLink}
        className={classes.link}
        to="/signup"
      >
        <FormattedMessage id="Sign Up" defaultMessage="Sign Up" />
      </Link>
    </React.Fragment>
  );
};

export default UnauthAction;
