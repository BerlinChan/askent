import React, { Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Link, Toolbar, Paper, Tabs, Tab } from "@material-ui/core";
import AppBarElevationScroll from "../AppBarElevationScroll";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";

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
  let { pathname } = useLocation();
  let { url } = useRouteMatch();
  const history = useHistory();
  const tabRoutes = [
    { label: "活动", to: `${url}/events` },
    { label: "分析", to: `${url}/analytics` }
  ];
  const getTabsValue = () => {
    const findIndex = tabRoutes.findIndex(tabItem => tabItem.to === pathname);
    return findIndex < 0 ? 0 : findIndex;
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
          <Tabs
            value={getTabsValue()}
            onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
              history.replace(tabRoutes[newValue].to);
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            {tabRoutes.map((tabItem, index) => (
              <Tab label={tabItem.label} key={index} />
            ))}
          </Tabs>
        </Paper>
      </Fragment>
    </AppBarElevationScroll>
  );
}
