import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Toolbar, Container } from "@material-ui/core";
import AppBarElevationScroll from "../../components/AppBarElevationScroll";
import HeaderAction from "../../components/HeaderAction";
import Logo from "../../components/Logo";

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

  return (
    <AppBarElevationScroll>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <Logo />
          <Box className={classes.actions}>
            <HeaderAction />
          </Box>
        </Toolbar>
      </Container>
    </AppBarElevationScroll>
  );
}
