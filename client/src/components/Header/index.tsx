import React from "react";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Link,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

interface Props {
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

export default function Header() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Link
              color="inherit"
              component={RouterLink}
              className={classes.title}
              to="/"
              variant="h6"
            >
              Askent
            </Link>
            <Link color="inherit" component={RouterLink} to="/login">
              Log In
            </Link>
            <Link color="inherit" component={RouterLink} to="/signup">
              Sign Up
            </Link>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      {/* Padding for top AppBar */}
      <Toolbar />
    </React.Fragment>
  );
}
