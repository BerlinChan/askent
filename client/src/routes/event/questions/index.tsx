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
  Tab
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
      minHeight: 360
    },
    tabPanel: {}
  })
);

const QuestionTabs = withStyles({
  root: {
    minHeight: 38
  }
})(Tabs);
const QuestionTab = withStyles({
  root: {
    minHeight: 38
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
            <Box className={classes.tabPanel}> Item One</Box>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Box className={classes.tabPanel}>Item 2</Box>
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Questions;
