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
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import EqualizerIcon from "@material-ui/icons/Equalizer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarRegular: {
      minHeight: 56
    },
    left: {
      display: "flex"
    },
    right: {
      display: "flex",
      justifyContent: "flex-end"
    },
    tabRoot: {
      minHeight: 56
    },
    tabIcon: {
      verticalAlign: "middle",
      marginRight: theme.spacing(1)
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
        <Toolbar classes={{ regular: classes.toolbarRegular }}>
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
                tabClasses={{ root: classes.tabRoot }}
                tabs={[
                  {
                    label: (
                      <Typography>
                        <QuestionAnswerIcon
                          fontSize="small"
                          className={classes.tabIcon}
                        />
                        提问
                      </Typography>
                    ),
                    to: `${url}/questions`
                  },
                  {
                    label: (
                      <Typography>
                        <EmojiObjectsIcon
                          fontSize="small"
                          className={classes.tabIcon}
                        />
                        点子
                      </Typography>
                    ),
                    to: `${url}/ideas`
                  },
                  {
                    label: (
                      <Typography>
                        <EqualizerIcon
                          fontSize="small"
                          className={classes.tabIcon}
                        />
                        投票
                      </Typography>
                    ),
                    to: `${url}/polls`
                  }
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
