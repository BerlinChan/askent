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
  useQuestionAddedSubscription,
  useQuestionUpdatedSubscription,
  useQuestionDeletedSubscription,
  EventQuery,
  EventQueryVariables,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  QuestionsByEventDocument
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import QuestionList from "./QuestionList";
import Confirm from "../../../components/Confirm";

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
    moderationOffTips: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%"
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
  const { data: eventData } = eventQuery;
  const questionsByEventQuery = useQuestionsByEventQuery({
    variables: { eventId: id as string }
  });
  const [updateEventMutation] = useUpdateEventMutation();
  const [confirmModeration, setConfirmModeration] = React.useState(false);

  // subscriptions
  const questionAddedSubscription = useQuestionAddedSubscription({
    variables: { eventId: id as string },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const questions = client.readQuery<
        QuestionsByEventQuery,
        QuestionsByEventQueryVariables
      >({
        query: QuestionsByEventDocument,
        variables: { eventId: id as string }
      });

      // merge
      client.writeQuery<QuestionsByEventQuery, QuestionsByEventQueryVariables>({
        query: QuestionsByEventDocument,
        variables: { eventId: id as string },
        data: {
          questionsByEvent: (subscriptionData.data?.questionAdded
            ? [subscriptionData.data?.questionAdded]
            : []
          ).concat(
            questions?.questionsByEvent ? questions?.questionsByEvent : []
          )
        }
      });
    }
  });
  const questionUpdatedSubscription = useQuestionUpdatedSubscription({
    variables: { eventId: id as string }
  });
  const questionDeletedSubscription = useQuestionDeletedSubscription({
    variables: { eventId: id as string },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const questions = client.readQuery<
        QuestionsByEventQuery,
        QuestionsByEventQueryVariables
      >({
        query: QuestionsByEventDocument,
        variables: { eventId: id as string }
      });

      // merge
      client.writeQuery<QuestionsByEventQuery, QuestionsByEventQueryVariables>({
        query: QuestionsByEventDocument,
        variables: { eventId: id as string },
        data: {
          questionsByEvent: (questions?.questionsByEvent
            ? questions?.questionsByEvent
            : []
          ).filter(
            item => item.id !== subscriptionData.data?.questionDeleted.id
          )
        }
      });
    }
  });

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };
  const handleModerationChange = async () => {
    if (eventData?.event.moderation) {
      setConfirmModeration(true);
    }
    await updateEventMutation({
      variables: {
        eventId: id as string,
        moderation: !eventData?.event.moderation
      }
    });
  };
  const handleModerationCancel = () => {
    setConfirmModeration(false);
  };
  const handleModerationOk = () => {
    //TODO: publish all unreview questions
    setConfirmModeration(false);
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
          <Confirm
            contentText={formatMessage({
              id: "Publish_all_unreview_questions?",
              defaultMessage: "Publish all unreview questions?"
            })}
            open={confirmModeration}
            onCancel={handleModerationCancel}
            onOk={handleModerationOk}
          />
        </Box>
        <Paper className={classes.gridItemPaper}>
          {eventData?.event.moderation ? (
            <QuestionList
              eventQuery={eventQuery}
              questionsByEventQuery={questionsByEventQuery}
              filter={item => !item.published}
            />
          ) : (
            <Box className={classes.moderationOffTips}>
              <Typography variant="h6" align="center" paragraph>
                Moderation is off
              </Typography>
              <Typography align="center">
                Incoming questions will automatically appear live.
              </Typography>
            </Box>
          )}
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
              eventQuery={eventQuery}
              questionsByEventQuery={questionsByEventQuery}
              filter={item => !item.archived && item.published}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <QuestionList
              eventQuery={eventQuery}
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
