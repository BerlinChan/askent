import React from "react";
import { useParams, useRouteMatch } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  MenuItem,
  Menu
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from "@material-ui/core/styles";
import {
  FormattedMessage,
  useIntl,
  FormattedDate,
  FormattedTime
} from "react-intl";
import TabPanel from "../../../components/TabPanel";
import SearchIcon from "@material-ui/icons/Search";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { useQuestionsByEventQuery } from "../../../generated/graphqlHooks";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    questionsGrid: {
      height: "100%"
    },
    gridItem: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    reviewActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap"
    },
    gridItemPaper: {
      flex: 1,
      overflowX: "hidden",
      overflowY: "auto"
    },
    list: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    listItem: { flexWrap: "wrap", position: "relative" },
    questionMeta: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1)
    },
    questionContent: { width: "100%" },
    questionMoreButton: {
      position: "absolute",
      top: 8,
      right: 8
    }
  })
);

const QuestionTabs = withStyles({
  root: {
    minHeight: 38
  }
})(Tabs);
const QuestionTab = withStyles({
  root: {
    minHeight: 38,
    minWidth: 120
  }
})(Tab);

const Questions: React.FC = () => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const { url, path } = useRouteMatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { data: questionsData } = useQuestionsByEventQuery({
    variables: { eventId: id as string }
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container spacing={3} className={classes.questionsGrid}>
      <Grid item sm={6} className={classes.gridItem}>
        <Box className={classes.reviewActions}>
          <Typography color="textSecondary">
            <FormattedMessage id="ForReview" defaultMessage="For view" />
          </Typography>
          <FormControlLabel
            labelPlacement="start"
            control={<Switch value="checkedC" />}
            label={formatMessage({
              id: "Moderation",
              defaultMessage: "Moderation"
            })}
          />
        </Box>
        <Paper className={classes.gridItemPaper}>
          <div>Event Questions</div>
          <ul>
            <li> id: {id}</li>
            <li> path: {path}</li>
            <li> url: {url}</li>
          </ul>
        </Paper>
      </Grid>
      <Grid item sm={6} className={classes.gridItem}>
        <Box className={classes.reviewActions}>
          <QuestionTabs value={tabIndex} onChange={handleChange}>
            <QuestionTab
              label={formatMessage({
                id: "Live",
                defaultMessage: "Live"
              })}
            />
            <QuestionTab
              label={formatMessage({
                id: "Archive",
                defaultMessage: "Archive"
              })}
            />
          </QuestionTabs>
          <Box>
            <SearchIcon color="inherit" fontSize="small" />
          </Box>
        </Box>
        <Paper className={classes.gridItemPaper}>
          <TabPanel value={tabIndex} index={0}>
            <List className={classes.list}>
              {questionsData?.questionsByEvent.map((item, index) => (
                <ListItem
                  key={index}
                  className={classes.listItem}
                  alignItems="flex-start"
                  divider
                >
                  <ListItemAvatar>
                    <Avatar src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {item.username ? (
                          item.username
                        ) : (
                          <FormattedMessage
                            id="Anonymous"
                            defaultMessage="Anonymous"
                          />
                        )}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <ThumbUpIcon style={{ fontSize: 12 }} />
                        <Typography
                          className={classes.questionMeta}
                          component="span"
                          variant="body2"
                          color="inherit"
                        >
                          {item.voteCount}
                        </Typography>
                        <AccessTimeIcon style={{ fontSize: 12 }} />
                        <Typography
                          className={classes.questionMeta}
                          component="span"
                          variant="body2"
                          color="inherit"
                        >
                          <FormattedDate value={item.updatedAt} />{" "}
                          <FormattedTime value={item.updatedAt} />
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Typography
                    className={classes.questionContent}
                    variant="body1"
                  >
                    {item.content}
                  </Typography>
                  <IconButton
                    size="small"
                    className={classes.questionMoreButton}
                    onClick={handleClick}
                  >
                    <MoreHorizIcon fontSize="inherit" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </Menu>
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            Item 2
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Questions;
