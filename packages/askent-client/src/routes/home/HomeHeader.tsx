import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";
import { Toolbar, Container, AppBar, Box } from "@material-ui/core";
import { ScrollSlide } from "../../components/ScrollHide";
import HeaderAction from "../../components/HeaderAction";
import Logo from "../../components/Logo";
import HomeMenu from "./HomeMenu";

const HIDE_THRESHOLD = 400;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hoverBox: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: alpha(theme.palette.background.paper, 0.05),
      color: theme.palette.primary.contrastText,
      zIndex: theme.zIndex.appBar,
    },
    toolbar: {
      justifyContent: "space-between",
    },
  })
);

export default function HomeHeader() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Box className={classes.hoverBox}>
        <Container maxWidth="lg" component="header" disableGutters>
          <Toolbar className={classes.toolbar}>
            <Logo />
            <HomeMenu />
            <HeaderAction />
          </Toolbar>
        </Container>
      </Box>

      <ScrollSlide threshold={HIDE_THRESHOLD} reverseIn>
        <AppBar elevation={4}>
          <Container maxWidth="lg" disableGutters>
            <Toolbar className={classes.toolbar}>
              <Logo />
              <HomeMenu />
              <HeaderAction />
            </Toolbar>
          </Container>
        </AppBar>
      </ScrollSlide>
    </React.Fragment>
  );
}
