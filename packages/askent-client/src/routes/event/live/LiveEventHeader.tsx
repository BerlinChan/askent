import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import {
  Box,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Hidden,
  useMediaQuery,
} from "@material-ui/core";
import { RouteTabs } from "../../../components/Tabs";
import MenuIcon from "@material-ui/icons/Menu";
import HeaderAction from "../../../components/HeaderAction";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import { FormattedMessage, FormattedDate, FormattedTime } from "react-intl";
import { EventDetailLiveQueryFieldsFragment } from "../../../generated/hasuraHooks";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      [theme.breakpoints.up("md")]: {
        zIndex: theme.zIndex.drawer + 1,
      },
    },
    toolbarRegular: {
      minHeight: 56,
    },
    left: {
      display: "flex",
      alignItems: "center",
    },
    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    right: {
      display: "flex",
      justifyContent: "flex-end",
    },
    tabRoot: {
      minHeight: 56,
    },
    tabIcon: {
      verticalAlign: "middle",
      marginRight: theme.spacing(1),
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      paddingTop: 56,
      width: drawerWidth,
    },
    drawerInfo: {
      margin: theme.spacing(1, 2),
    },
  })
);

interface Props {
  eventDetailData: EventDetailLiveQueryFieldsFragment | undefined;
}

const LiveEventHeader: React.FC<Props> = ({ eventDetailData }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const renderEventName = (
    <Typography variant="h6" color="inherit" noWrap>
      {eventDetailData?.name}
    </Typography>
  );
  const renderRouteTabs = (
    <RouteTabs
      variant="fullWidth"
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
          to: `questions`,
        },
        {
          label: (
            <Typography>
              <EmojiObjectsIcon fontSize="small" className={classes.tabIcon} />
              <FormattedMessage id="Ideas" defaultMessage="Ideas" />
            </Typography>
          ),
          to: `ideas`,
        },
        {
          label: (
            <Typography>
              <EqualizerIcon fontSize="small" className={classes.tabIcon} />
              <FormattedMessage id="Polls" defaultMessage="Polls" />
            </Typography>
          ),
          to: `polls`,
        },
      ]}
    />
  );

  return (
    <React.Fragment>
      <AppBar
        position={matchMdUp ? "static" : "sticky"}
        elevation={2}
        className={classes.appBar}
      >
        <React.Fragment>
          <Toolbar classes={{ regular: classes.toolbarRegular }}>
            <Grid container>
              <Grid item xs={3} className={classes.left}>
                <IconButton color="inherit" onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>
                <Hidden smDown>{renderEventName}</Hidden>
              </Grid>
              <Grid item xs={6} className={classes.center}>
                <Hidden smDown>{renderRouteTabs}</Hidden>
                <Hidden mdUp>{renderEventName}</Hidden>
              </Grid>
              <Grid item xs={3} className={classes.right}>
                <HeaderAction />
              </Grid>
            </Grid>
          </Toolbar>
          <Hidden mdUp>{renderRouteTabs}</Hidden>
        </React.Fragment>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant={matchMdUp ? "persistent" : "temporary"}
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
        open={open}
        onClose={handleDrawerToggle}
      >
        <Box className={classes.drawerInfo}>
          <Typography>{eventDetailData?.name}</Typography>
          <Typography variant="body2">
            <FormattedDate value={eventDetailData?.startAt} />
            {", "}
            <FormattedTime value={eventDetailData?.startAt} />
            {" ~ "}
            <FormattedDate value={eventDetailData?.endAt} />
            {", "}
            <FormattedTime value={eventDetailData?.endAt} />
          </Typography>
          <Typography variant="body2" color="textSecondary">
            # {eventDetailData?.code}
          </Typography>
        </Box>
        <Divider />
        <List>
          {["Live interaction", "Switch event", "About Askent"].map((text) => (
            <ListItem button key={text}>
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
