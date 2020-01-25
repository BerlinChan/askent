import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Toolbar, Container } from "@material-ui/core";
import AppBarElevationScroll from "../../components/AppBarElevationScroll";
import { Logo, UnauthAction, AuthedAction } from "../../components/Header";
import { AUTH_TOKEN } from "../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    actions: {
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
      "& > *": { margin: theme.spacing(1) }
    }
  })
);

export default function HomeHeader() {
  const classes = useStyles();
  const token = localStorage.getItem(AUTH_TOKEN);

  return (
    <AppBarElevationScroll>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <Logo />
          <Box className={classes.actions}>
            {token ? <AuthedAction /> : <UnauthAction />}
          </Box>
        </Toolbar>
      </Container>
    </AppBarElevationScroll>
  );
}
