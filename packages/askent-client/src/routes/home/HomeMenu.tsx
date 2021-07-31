import React from "react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { Link, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: "flex",
      alignItems: "center",
    },
    link: { marginLeft: theme.spacing(2) },
  })
);

interface Props {}

const HomeMenu: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <Box className={classes.header}>
      <Link
        color="inherit"
        variant="subtitle1"
        underline="none"
        component={RouterLink}
        className={classes.link}
        to="/about"
      >
        <FormattedMessage id="About" defaultMessage="About" />
      </Link>
      <Link
        color="inherit"
        variant="subtitle1"
        underline="none"
        className={classes.link}
        href="https://www.berlinchan.com/tag/askent/"
      >
        <FormattedMessage id="Blog" defaultMessage="Blog" />
      </Link>
      <Link
        color="inherit"
        variant="subtitle1"
        underline="none"
        className={classes.link}
        href="https://github.com/BerlinChan/askent/"
      >
        GitHub
      </Link>
    </Box>
  );
};

export default HomeMenu;
