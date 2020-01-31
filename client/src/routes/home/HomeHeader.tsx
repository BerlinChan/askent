import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Toolbar, Container } from "@material-ui/core";
import AppBarElevationScroll from "../../components/AppBarElevationScroll";
import { UnauthAction, AuthedAction } from "../../components/Header";
import Logo from "../../components/Logo";
import { useToken } from "../../hooks";

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
  const { token } = useToken();

  return (
    <AppBarElevationScroll>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <Logo />
          <Box className={classes.actions}>
            {token.authToken ? <AuthedAction /> : <UnauthAction />}
          </Box>
        </Toolbar>
      </Container>
    </AppBarElevationScroll>
  );
}
