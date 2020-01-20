import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Link, Toolbar, Container } from "@material-ui/core";
import AppBarElevationScroll from "../../components/AppBarElevationScroll";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    actions: { "& > *": { margin: theme.spacing(1) } }
  })
);

export default function HomeHeader() {
  const classes = useStyles();

  return (
    <AppBarElevationScroll>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <Link color="inherit" component={RouterLink} to="/" variant="h6">
            Askent
          </Link>
          <Box className={classes.actions}>
            <Link color="inherit" component={RouterLink} to="/admin">
              Admin
            </Link>
            <Link color="inherit" component={RouterLink} to="/login">
              Log In
            </Link>
            <Link color="inherit" component={RouterLink} to="/signup">
              Sign Up
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBarElevationScroll>
  );
}
