import React from "react";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
  Typography,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import SearchIcon from "@material-ui/icons/Search";
import {
  useQuestionsByEventQuery,
  useUpdateEventMutation,
  useQuestionAddedSubscription,
  useQuestionUpdatedSubscription,
  useQuestionRemovedSubscription,
  useDeleteAllUnpublishedQuestionsMutation,
  usePublishAllUnpublishedQuestionsMutation,
  AdminEventQuery,
  AdminEventQueryVariables,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  QuestionsByEventDocument,
  RoleName
} from "../../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import QuestionList from "./QuestionList";
import Confirm from "../../../../components/Confirm";
import { SubTabs, SubTab } from "../../../../components/Tabs";
import TabPanel from "../../../../components/TabPanel";
import { DEFAULT_PAGE_FIRST, DEFAULT_PAGE_SKIP } from "../../../../constant";

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
    listActions: {
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

interface Props {
  eventQuery: QueryResult<AdminEventQuery, AdminEventQueryVariables>;
}

const Questions: React.FC<Props> = ({ eventQuery }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { data } = eventQuery;
  const questionsByEventQuery = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP }
    }
  });
  const [updateEventMutation] = useUpdateEventMutation();
  const [
    deleteAllUnpublishedQuestionsMutation
  ] = useDeleteAllUnpublishedQuestionsMutation();
  const [
    publishAllUnpublishedQuestionsMutation
  ] = usePublishAllUnpublishedQuestionsMutation();
  const [confirmModeration, setConfirmModeration] = React.useState(false);

  // subscriptions
  useQuestionAddedSubscription({
    variables: { eventId: id as string, role: RoleName.Admin },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const prev = questionsByEventQuery.data;

        if (prev) {
          // add
          client.writeQuery<
            QuestionsByEventQuery,
            QuestionsByEventQueryVariables
          >({
            query: QuestionsByEventDocument,
            variables: {
              eventId: id as string,
              pagination: {
                first: prev.questionsByEvent.first,
                skip: prev.questionsByEvent.skip
              }
            },
            data: {
              questionsByEvent: {
                ...prev.questionsByEvent,
                totalCount: prev.questionsByEvent.totalCount + 1,
                list: [subscriptionData.data.questionAdded].concat(
                  prev.questionsByEvent.list.filter(
                    question =>
                      question.id !== subscriptionData.data?.questionAdded.id
                  )
                )
              }
            }
          });
        }
      }
    }
  });
  useQuestionUpdatedSubscription({
    variables: { eventId: id as string }
  });
  useQuestionRemovedSubscription({
    variables: { eventId: id as string },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const prev = questionsByEventQuery.data;

        if (prev) {
          // remove
          client.writeQuery<
            QuestionsByEventQuery,
            QuestionsByEventQueryVariables
          >({
            query: QuestionsByEventDocument,
            variables: {
              eventId: id as string,
              pagination: {
                first: prev.questionsByEvent.first,
                skip: prev.questionsByEvent.skip
              }
            },
            data: {
              questionsByEvent: {
                ...prev.questionsByEvent,
                totalCount:
                  prev.questionsByEvent.totalCount -
                  subscriptionData.data.questionsRemoved.length,
                list: R.without(
                  subscriptionData.data.questionsRemoved,
                  prev.questionsByEvent.list
                )
              }
            }
          });
        }
      }
    }
  });

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };
  const handleModerationChange = async () => {
    if (data?.eventById.moderation) {
      setConfirmModeration(true);
    } else {
      await updateEventMutation({
        variables: {
          eventId: id as string,
          moderation: true
        }
      });
    }
  };
  const handleDeleteAll = async () => {
    await deleteAllUnpublishedQuestionsMutation({
      variables: { eventId: id as string }
    });
    await updateEventMutation({
      variables: {
        eventId: id as string,
        moderation: false
      }
    });
    setConfirmModeration(false);
  };
  const handlePublishAll = async () => {
    await publishAllUnpublishedQuestionsMutation({
      variables: { eventId: id as string }
    });
    await updateEventMutation({
      variables: {
        eventId: id as string,
        moderation: false
      }
    });
    setConfirmModeration(false);
  };

  return (
    <Grid container spacing={3} className={classes.questionsGrid}>
      <Grid item sm={6} className={classes.gridItem}>
        <Box className={classes.listActions}>
          <Typography color="textSecondary">
            <FormattedMessage id="ForReview" defaultMessage="For view" />
          </Typography>
          <FormControlLabel
            labelPlacement="start"
            control={
              <Switch
                checked={Boolean(data?.eventById.moderation)}
                onChange={handleModerationChange}
              />
            }
            label={formatMessage({
              id: "Moderation",
              defaultMessage: "Moderation"
            })}
          />
          <Confirm
            disableBackdropClick
            disableEscapeKeyDown
            contentText={formatMessage({
              id: "Publish_or_delete_all_unreview_questions?",
              defaultMessage: "Publish or delete all unreview questions?"
            })}
            open={confirmModeration}
            cancelText={
              <Typography color="error" variant="subtitle1">
                <FormattedMessage id="Delete" defaultMessage="Delete" />
              </Typography>
            }
            okText={
              <Typography variant="subtitle1">
                <FormattedMessage id="Publish" defaultMessage="Publish" />
              </Typography>
            }
            onCancel={handleDeleteAll}
            onOk={handlePublishAll}
          />
        </Box>
        <Paper className={classes.gridItemPaper}>
          {data?.eventById.moderation ? (
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
        <Box className={classes.listActions}>
          <SubTabs value={tabIndex} onChange={handleTabsChange}>
            <SubTab
              label={formatMessage({
                id: "Live",
                defaultMessage: "Live"
              })}
            />
            <SubTab
              label={formatMessage({
                id: "Archive",
                defaultMessage: "Archive"
              })}
            />
          </SubTabs>
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
