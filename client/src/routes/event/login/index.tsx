import React from "react";
import { Box } from "@material-ui/core";
import { useRouteMatch, useParams } from "react-router-dom";
import Logo from "../../../components/Logo";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventLogin: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: `radial-gradient(circle, 
        ${fade(theme.palette.primary.main, 0.1)} 0%,
         ${fade(theme.palette.primary.main, 0.3)} 100%)`
    }
  })
);

const EventLogin: React.FC = () => {
  const classes = useStyles();
  let { path, url } = useRouteMatch();
  let { id } = useParams();

  return (
    <Box className={classes.eventLogin}>
      <Box textAlign="center">
        <Logo />
        <div>path: {path}</div>
        <div>url: {url}</div>
        <div>id: {id}</div>
      </Box>
      <Box textAlign="center">
        <FormattedMessage id="Welcome" defaultMessage="Welcome" />
      </Box>
      <Box textAlign="center">
        {}
      </Box>
    </Box>
  );
};

export default EventLogin;
