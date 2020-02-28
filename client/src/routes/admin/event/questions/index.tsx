import React from "react";
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
  useDeleteAllReviewQuestionsMutation,
  usePublishAllReviewQuestionsMutation,
  AdminEventQuery,
  AdminEventQueryVariables,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  QuestionsByEventDocument,
  RoleName,
  QuestionReviewStatus,
  OrderByArg
} from "../../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import QuestionList from "./QuestionList";
import Confirm from "../../../../components/Confirm";
import { SubTabs, SubTab } from "../../../../components/Tabs";
import { DEFAULT_PAGE_FIRST, DEFAULT_PAGE_SKIP } from "../../../../constant";
import { DataProxy } from "apollo-cache";

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
  const [updateEventMutation] = useUpdateEventMutation();
  const [
    deleteAllReviewQuestionsMutation
  ] = useDeleteAllReviewQuestionsMutation();
  const [
    publishAllReviewQuestionsMutation
  ] = usePublishAllReviewQuestionsMutation();
  const [confirmModeration, setConfirmModeration] = React.useState(false);
  const questionsByEventQuery = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      where: { reviewStatus: QuestionReviewStatus.Publish },
      orderBy: { createdAt: OrderByArg.Desc },
      pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP }
    }
  });
  const questionsByEventQueryReview = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      where: { reviewStatus: QuestionReviewStatus.Review },
      orderBy: { createdAt: OrderByArg.Desc },
      pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP }
    }
  });
  const questionsByEventQueryArchive = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      where: { reviewStatus: QuestionReviewStatus.Archive },
      orderBy: { createdAt: OrderByArg.Desc },
      pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP }
    }
  });

  // subscriptions
  const getPrev = (
    reviewStatus: QuestionReviewStatus
  ): QuestionsByEventQuery | undefined => {
    switch (reviewStatus) {
      case QuestionReviewStatus.Review:
        return questionsByEventQueryReview.data;
      case QuestionReviewStatus.Publish:
        return questionsByEventQuery.data;
      case QuestionReviewStatus.Archive:
        return questionsByEventQueryArchive.data;
    }
  };
  const updateCache = (
    cache: DataProxy,
    eventId: string,
    reviewStatus: QuestionReviewStatus,
    data: QuestionsByEventQuery
  ) => {
    cache.writeQuery<
      QuestionsByEventQuery,
      Omit<QuestionsByEventQueryVariables, "pagination">
    >({
      query: QuestionsByEventDocument,
      variables: {
        eventId,
        where: { reviewStatus }
      },
      data
    });
  };
  useQuestionAddedSubscription({
    variables: { eventId: id as string, role: RoleName.Admin },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;
        const prev = getPrev(questionAdded.reviewStatus);

        if (prev) {
          // add
          updateCache(client, id as string, questionAdded.reviewStatus, {
            questionsByEvent: {
              ...prev.questionsByEvent,
              totalCount: prev.questionsByEvent.totalCount + 1,
              list: [questionAdded].concat(
                prev.questionsByEvent.list.filter(
                  question => question.id !== questionAdded.id
                )
              )
            }
          });
        }
      }
    }
  });
  useQuestionUpdatedSubscription({
    variables: { eventId: id as string, role: RoleName.Admin }
  });
  useQuestionRemovedSubscription({
    variables: { eventId: id as string, role: RoleName.Admin },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.questionRemoved) {
        const { questionRemoved } = subscriptionData.data;
        const prev = getPrev(questionRemoved.reviewStatus);

        if (prev) {
          // remove
          updateCache(client, id as string, questionRemoved.reviewStatus, {
            questionsByEvent: {
              ...prev.questionsByEvent,
              totalCount: prev.questionsByEvent.totalCount - 1,
              list: prev.questionsByEvent.list.filter(
                preQuestion => questionRemoved.id !== preQuestion.id
              )
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
    await deleteAllReviewQuestionsMutation({
      variables: { eventId: id as string },
      update: (cache, mutationResult) => {
        updateCache(cache, id as string, QuestionReviewStatus.Review, {
          questionsByEvent: {
            skip: DEFAULT_PAGE_SKIP,
            first: DEFAULT_PAGE_FIRST,
            totalCount: 0,
            hasNextPage: false,
            list: []
          }
        });
      }
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
    await publishAllReviewQuestionsMutation({
      variables: { eventId: id as string },
      update: (cache, mutationResult) => {
        updateCache(cache, id as string, QuestionReviewStatus.Review, {
          questionsByEvent: {
            skip: DEFAULT_PAGE_SKIP,
            first: DEFAULT_PAGE_FIRST,
            totalCount: 0,
            hasNextPage: false,
            list: []
          }
        });
      }
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
              questionsByEventQuery={questionsByEventQueryReview}
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
          <QuestionList
            eventQuery={eventQuery}
            questionsByEventQuery={
              tabIndex === 0
                ? questionsByEventQuery
                : questionsByEventQueryArchive
            }
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Questions;
