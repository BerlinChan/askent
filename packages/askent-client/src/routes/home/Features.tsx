import React from "react";
import { Grid, Container, Typography, Box, Link } from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import IconGene from "./img/icon-gene.png";
import IconCrossPlatform from "./img/icon-cross-platform.png";
import IconOpenSource from "./img/icon-open-source.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    featureTitle: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(4),
    },
    featureItem: {
      padding: theme.spacing(0, 4),
    },
    featureIcon: {
      position: "relative",
      textAlign: "center",
      marginBottom: theme.spacing(3),
      "& img": {
        width: "30%",
      },
      "&:before": {
        position: "absolute",
        bottom: 0,
        right: "30%",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        content: "''",
        backgroundColor: alpha("#15aab9", 0.1),
        zIndex: -1,
      },
      "&:after": {
        position: "absolute",
        top: "5%",
        left: "34%",
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        content: "''",
        backgroundColor: alpha("#6f7fda", 0.1),
        zIndex: -1,
      },
    },
  })
);

const Features: React.FC = (props) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Typography
        className={classes.featureTitle}
        align="center"
        color="textPrimary"
        variant="h4"
      >
        <FormattedMessage id="Features" defaultMessage="Features" />
      </Typography>
      <Grid container>
        <Grid item md={4} className={classes.featureItem}>
          <Box className={classes.featureIcon}>
            <img src={IconGene} alt="Clone of Slido" />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle1"
            gutterBottom
          >
            <FormattedMessage
              id="Clone of Slido"
              defaultMessage="Clone of Slido"
            />
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            variant="body1"
            gutterBottom
          >
            <FormattedMessage
              id="Slido is a great tool for hybrid meetings with an easy-to-use and elegant design. Askent is a simple clone of it."
              defaultMessage="Slido is a great tool for hybrid meetings with an easy-to-use and elegant design. Askent is a simple clone of it."
            />
            <Link
              href="https://www.sli.do/"
              target="_blank"
              rel="noreferrer"
              underline="none"
              color="inherit"
            >
              {" "}
              <FormattedMessage id="Goto Slido" defaultMessage="Goto Slido" />
            </Link>
          </Typography>
        </Grid>
        <Grid item md={4} className={classes.featureItem}>
          <Box className={classes.featureIcon}>
            <img src={IconOpenSource} alt="Open Source" />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle1"
            gutterBottom
          >
            <FormattedMessage id="Open Source" defaultMessage="Open Source" />
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            variant="body1"
            gutterBottom
          >
            <FormattedMessage
              id="Initially, Askent was built for tech-exploring, it's open-source under GPL-3.0 License, just clone and have fun with it!"
              defaultMessage="Initially, Askent was built for tech-exploring, it's open-source  under GPL-3.0 License, just clone and have fun with it!"
            />
            <Link
              href="https://github.com/BerlinChan/askent"
              target="_blank"
              rel="noreferrer"
              underline="none"
              color="inherit"
            >
              {" "}
              <img
                style={{ verticalAlign: "top" }}
                alt="GitHub Repo stars"
                src="https://img.shields.io/github/stars/BerlinChan/askent?style=social"
              />
            </Link>
          </Typography>
        </Grid>
        <Grid item md={4} className={classes.featureItem}>
          <Box className={classes.featureIcon}>
            <img src={IconCrossPlatform} alt="Cross Platform" />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle1"
            gutterBottom
          >
            <FormattedMessage
              id="Cross Platform"
              defaultMessage="Cross Platform"
            />
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            variant="body1"
            gutterBottom
          >
            <FormattedMessage
              id="Askent is a web app, leverages the browser's cross-platform ability, it can run anywhere, even on SmartTV."
              defaultMessage="Askent is a web app, leverages the browser's cross-platform ability, it can run anywhere, even on SmartTV."
            />
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Features;
