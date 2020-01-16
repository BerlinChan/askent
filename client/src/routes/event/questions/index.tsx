import React from "react";
import { useParams } from "react-router-dom";
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
import {
  useQuestionsByEventQuery,
  useUpdateEventMutation,
  EventQuery,
  EventQueryVariables
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import QuestionList from "./QuestionList";

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

interface Props {
  eventQuery: QueryResult<EventQuery, EventQueryVariables>;
}

const Questions: React.FC<Props> = ({ eventQuery }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { data: eventData, refetch: eventRefetch } = eventQuery;
  const questionsByEventQuery = useQuestionsByEventQuery({
    variables: { eventId: id as string }
  });
  const [updateEventMutation] = useUpdateEventMutation();

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };
  const handleModerationChange = async () => {
    await updateEventMutation({
      variables: {
        eventId: id as string,
        moderation: !eventData?.event.moderation
      }
    });
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
            control={
              <Switch
                checked={Boolean(eventData?.event.moderation)}
                onChange={handleModerationChange}
              />
            }
            label={formatMessage({
              id: "Moderation",
              defaultMessage: "Moderation"
            })}
          />
        </Box>
        <Paper className={classes.gridItemPaper}>
          <QuestionList
            questionsByEventQuery={questionsByEventQuery}
            filter={item => !item.published}
          />
        </Paper>
      </Grid>
      <Grid item sm={6} className={classes.gridItem}>
        <Box className={classes.reviewActions}>
          <QuestionTabs value={tabIndex} onChange={handleTabsChange}>
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
            <QuestionList
              questionsByEventQuery={questionsByEventQuery}
              filter={item => !item.archived && item.published}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <QuestionList
              questionsByEventQuery={questionsByEventQuery}
              filter={item => item.archived && item.published}
            />
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Questions;
