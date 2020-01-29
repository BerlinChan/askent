import React from "react";
import { useRouteMatch } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Typography, Toolbar, IconButton } from "@material-ui/core";
import { RouteTabs } from "../../components/Tabs";
import MenuIcon from "@material-ui/icons/Menu";
import {
  LiveEventQuery,
  LiveEventQueryVariables
} from "../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import AppBarElevationScroll from "../../components/AppBarElevationScroll";
import { AudienceAction } from "../../components/Header";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    left: {
      display: "flex"
    },
    right: {
      display: "flex",
      justifyContent: "flex-end"
    }
  })
);

interface Props {
  eventQuery: QueryResult<LiveEventQuery, LiveEventQueryVariables>;
  body: React.ReactElement;
}

const LiveEventHeader: React.FC<Props> = ({ eventQuery, body }) => {
  const classes = useStyles();
  let { url } = useRouteMatch();
  const { data } = eventQuery;

  return (
    <React.Fragment>
      <AppBarElevationScroll>
        <Toolbar>
          <Grid container>
            <Grid item xs={3} className={classes.left}>
              <IconButton color="inherit">
                <MenuIcon />
              </IconButton>
              <Typography color="inherit" noWrap>
                {data?.eventById.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <RouteTabs
                centered
                indicatorColor="secondary"
                textColor="inherit"
                tabs={[
                  { label: "提问", to: `${url}/questions` },
                  { label: "点子", to: `${url}/ideas` },
                  { label: "投票", to: `${url}/polls` }
                ]}
              />
            </Grid>
            <Grid item xs={3} className={classes.right}>
              <AudienceAction />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBarElevationScroll>
      {body}
    </React.Fragment>
  );
};

export default LiveEventHeader;
