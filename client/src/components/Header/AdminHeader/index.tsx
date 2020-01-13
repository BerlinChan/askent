import React, { Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Link, Toolbar, Paper } from "@material-ui/core";
import AppBarElevationScroll from "../AppBarElevationScroll";
import { useRouteMatch } from "react-router-dom";
import RouteTabs from "../RouteTabs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    actions: { "& > *": { margin: theme.spacing(1) } }
  })
);

export function AdminHeader() {
  const classes = useStyles();
  let { url } = useRouteMatch();

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
              { label: "活动", to: `${url}/events` },
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
