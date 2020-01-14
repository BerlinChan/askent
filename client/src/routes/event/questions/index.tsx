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
  Avatar
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import TabPanel from "../../../components/TabPanel";
import SearchIcon from "@material-ui/icons/Search";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';



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
    listItem: { flexWrap: "wrap" }
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
  let { id } = useParams();
  const { url, path } = useRouteMatch();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
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
              <ListItem
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
                      Anonymous
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <AccessTimeIcon style={{ fontSize: 12 }} />
                      <ThumbUpIcon style={{ fontSize: 12 }} />
                      <ThumbDownIcon style={{ fontSize: 12 }} />
                      <Typography
                        component="span"
                        variant="body2"
                        color="inherit"
                      >
                        Ali Connors
                      </Typography>
                    </React.Fragment>
                  }
                />
                <Typography variant="body1">
                  sadfsd sdfsd fasdfsadfasdf sadf sdfsaf sadf ds fsad sdfsad fsd
                  fasf sadfsdf safsdfas.
                </Typography>
              </ListItem>
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
