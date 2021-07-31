import React from "react";
import { Grid, Container, Typography, Box } from "@material-ui/core";
import HomeHeader from "./HomeHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import JoinEventForm from "./JoinEventForm";
import { FormattedMessage } from "react-intl";
import heroConference from "./img/hero-conference.png";
import heroImgPad from "./img/hero-iPad.png";
import heroImgPhone from "./img/hero-iPhone-X.png";
import heroImgLaptop from "./img/hero-Macbook-Pro-16.png";
import Features from "./Features";
import { CSSTransition } from "react-transition-group";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hero: {
      position: "relative",
      width: "100%",
      height: "100%",
      paddingTop: theme.spacing(8),
      backgroundImage: `url(${heroConference})`,
      backgroundPosition: "80% bottom",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 85%",
      [theme.breakpoints.down("sm")]: {
        backgroundSize: "auto 38%",
      },
    },
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.9,
      background: `linear-gradient(135deg,
        #15aab9 0%,
        #6f7fda 100%)`,
      zIndex: -1,
    },
    circleBg: {
      "&:before": {
        position: "absolute",
        top: "20%",
        right: "30%",
        content: "''",
        opacity: 1,
        width: "120px",
        height: "120px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
      },
      "&:after": {
        position: "absolute",
        top: "40%",
        left: "30%",
        content: "''",
        opacity: 1,
        width: "200px",
        height: "200px",
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "50%",
      },
    },
    circleBg2: {
      "&:before": {
        position: "absolute",
        top: "-2%",
        left: "7%",
        content: "''",
        opacity: 1,
        width: "100px",
        height: "100px",
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "50%",
      },
      "&:after": {
        position: "absolute",
        bottom: "10%",
        right: "2%",
        content: "''",
        opacity: 1,
        width: "150px",
        height: "150px",
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "50%",
      },
    },
    description: {
      marginTop: theme.spacing(3),
      color: theme.palette.common.white,
      fontWeight: theme.typography.fontWeightBold,
    },
    heroBgDevices: {
      position: "relative",
      width: "100%",
      minHeight: theme.spacing(38),
    },
    heroImgLaptop: {
      position: "absolute",
      width: "60%",
      height: "auto",
      right: "6%",
      bottom: "-3.3%",
      "&-appear": {
        opacity: 0,
        transform: "translateX(5%)",
      },
      "&-appear-active": {
        opacity: 1,
        transform: "translateX(0)",
        transition: theme.transitions.create(["opacity", "transform"], {
          duration: 2000,
          delay: 1000,
        }),
      },
      "&-appear-done": {
        opacity: 1,
        transform: "translateX(0)",
      },
    },
    heroImgPad: {
      position: "absolute",
      width: "40%",
      height: "auto",
      right: "2%",
      bottom: "-14%",
      "&-appear": {
        opacity: 0,
        transform: "translateX(5%)",
      },
      "&-appear-active": {
        opacity: 1,
        transform: "translateX(0)",
        transition: theme.transitions.create(["opacity", "transform"], {
          duration: 2000,
          delay: 2000,
        }),
      },
      "&-appear-done": {
        opacity: 1,
        transform: "translateX(0)",
      },
    },
    heroImgPhone: {
      position: "absolute",
      width: "14%",
      height: "auto",
      right: "58%",
      bottom: "-5%",
      "&-appear": {
        opacity: 0,
        transform: "translateX(5%)",
      },
      "&-appear-active": {
        opacity: 1,
        transform: "translateX(0)",
        transition: theme.transitions.create(["opacity", "transform"], {
          duration: 2000,
          delay: 3000,
        }),
      },
      "&-appear-done": {
        opacity: 1,
        transform: "translateX(0)",
      },
    },
  })
);

const Home: React.FC = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Box className={classes.hero}>
        <HomeHeader />
        <Box className={classes.gradientBackground}></Box>
        <Box className={classes.circleBg}></Box>
        <Box className={classes.circleBg2}></Box>

        <Container maxWidth="lg">
          <Grid container>
            <Grid item md={4}>
              <Typography
                className={classes.description}
                variant="h3"
                gutterBottom
              >
                <FormattedMessage
                  id="A simple interaction tool for the meeting."
                  defaultMessage="A simple interaction tool for the meeting."
                />
              </Typography>
              <Typography className={classes.description} variant="h5">
                <FormattedMessage
                  id="So you can better reach out audience."
                  defaultMessage="So you can better reach out audience."
                />
              </Typography>
              <JoinEventForm />
            </Grid>
            <Grid item md={8} className={classes.heroBgDevices}>
              <CSSTransition
                in
                appear
                timeout={2000}
                classNames={classes.heroImgLaptop}
              >
                <img
                  className={classes.heroImgLaptop}
                  src={heroImgLaptop}
                  alt=""
                />
              </CSSTransition>
              <CSSTransition
                in
                appear
                timeout={2000}
                classNames={classes.heroImgPad}
              >
                <img className={classes.heroImgPad} src={heroImgPad} alt="" />
              </CSSTransition>
              <CSSTransition
                in
                appear
                timeout={2000}
                classNames={classes.heroImgPhone}
              >
                <img
                  className={classes.heroImgPhone}
                  src={heroImgPhone}
                  alt=""
                />
              </CSSTransition>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Features />
      <div style={{ height: 400 }}></div>
    </React.Fragment>
  );
};

export default Home;
