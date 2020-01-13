import React, { Fragment } from "react";
import { matchPath } from "react-router";
import {
  Link as RouterLink,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Link, Toolbar, Paper } from "@material-ui/core";
import AppBarElevationScroll from "../AppBarElevationScroll";
import RouteTabs from "../RouteTabs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    actions: { "& > *": { margin: theme.spacing(1) } }
  })
);

export function EventHeader() {
  const classes = useStyles();
  let { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { url } = matchPath(pathname, { path: `${path}/:id` }) as {
    url: string;
  };

  return (
    <AppBarElevationScroll>
      <Fragment>
        <Toolbar className={classes.toolbar}>
          <Link color="inherit" component={RouterLink} to="/" variant="h6">
            Askent
          </Link>
          <Box className={classes.actions}>
            <Link color="inherit" component={RouterLink} to="/admin">
              Admin
            </Link>
          </Box>
        </Toolbar>
        <Paper elevation={0} square>
          <RouteTabs
            tabs={[
              { label: "问答", to: `${url}/questions` },
              { label: "调查", to: `${url}/polls` },
              { label: "分析", to: `${url}/analytics` }
            ]}
            indicatorColor="primary"
            textColor="primary"
            centered
          />
        </Paper>
      </Fragment>
    </AppBarElevationScroll>
  );
}
