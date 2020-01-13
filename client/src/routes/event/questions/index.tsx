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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    questionsGrid: { marginTop: theme.spacing(1) },
    reviewActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap"
    },
    tabPanel: {
      minHeight: 200,
      display: "flex",
      alignItems: "stretch"
    }
  })
);

const QuestionTabs = withStyles({
  root: {
    minHeight: 32
  }
})(Tabs);
const QuestionTab = withStyles({
  root: {
    minHeight: 32
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
    <React.Fragment>
      <Grid container spacing={3} className={classes.questionsGrid}>
        <Grid item sm={6}>
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
          <li>
            <div>Event Questions</div>
            <ul>
              <li> id: {id}</li>
              <li> path: {path}</li>
              <li> url: {url}</li>
            </ul>
          </li>
        </Grid>
        <Grid item sm={6}>
          <Paper>
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
            <TabPanel value={tabIndex} index={0}>
              <Box className={classes.tabPanel}> Item One</Box>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Box className={classes.tabPanel}>Item 2</Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Questions;
