import React from "react";
import { useRouteMatch } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import { RouteTabs } from "../../components/Tabs";
import MenuIcon from "@material-ui/icons/Menu";
import {
  MeAudienceQuery,
  MeAudienceQueryVariables,
  LiveEventQuery,
  LiveEventQueryVariables
} from "../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import AppBarElevationScroll from "../../components/AppBarElevationScroll";
import { AudienceAction } from "../../components/Header";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import { FormattedMessage } from "react-intl";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: { zIndex: theme.zIndex.drawer + 1 },
    toolbarRegular: {
      minHeight: 56
    },
    left: {
      display: "flex",
      alignItems: "center"
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
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      paddingTop: 56,
      width: drawerWidth
    }
  })
);

interface Props {
  userQueryResult: QueryResult<MeAudienceQuery, MeAudienceQueryVariables>;
  eventQueryResult: QueryResult<LiveEventQuery, LiveEventQueryVariables>;
}

const LiveEventHeader: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult
}) => {
  const classes = useStyles();
  let { url } = useRouteMatch();
  const { data } = eventQueryResult;
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <AppBarElevationScroll className={classes.appBar}>
        <Toolbar classes={{ regular: classes.toolbarRegular }}>
          <Grid container>
            <Grid item xs={3} className={classes.left}>
              <IconButton color="inherit" onClick={handleDrawerToggle}>
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
                        <FormattedMessage id="Q&A" defaultMessage="Q&A" />
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
                        <FormattedMessage id="Ideas" defaultMessage="Ideas" />
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
                        <FormattedMessage id="Polls" defaultMessage="Polls" />
                      </Typography>
                    ),
                    to: `${url}/polls`
                  }
                ]}
              />
            </Grid>
            <Grid item xs={3} className={classes.right}>
              <AudienceAction userQueryResult={userQueryResult} />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBarElevationScroll>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{ paper: classes.drawerPaper }}
      >
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={index}>
              <ListItemIcon>
                <QuestionAnswerIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </React.Fragment>
  );
};

export default LiveEventHeader;
