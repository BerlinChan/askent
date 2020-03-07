import React from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, Box, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import {
  useQuestionsByEventQuery,
  useQuestionAddedSubscription,
  useQuestionUpdatedSubscription,
  useQuestionRemovedSubscription,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  QuestionsByEventDocument,
  RoleName,
  ReviewStatus
} from "../../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import QuestionList from "./QuestionList";
import ActionReview from "./ActionReview";
import ActionRight from "./ActionRight";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";
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
      flexWrap: "nowrap",
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
  eventQuery: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const Questions: React.FC<Props> = ({ eventQuery }) => {
  const classes = useStyles();
  const { id } = useParams();
  const tabIndexState = React.useState(0);
  const searchState = React.useState({
    value: "",
    active: false
  });
  const { data: eventData } = eventQuery;
  const questionsByEventQuery = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      reviewStatus: [ReviewStatus.Publish],
      // orderBy: { createdAt: OrderByArg.Desc },
      pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
    }
  });
  const questionsByEventQueryReview = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      reviewStatus: [ReviewStatus.Review],
      // orderBy: { createdAt: OrderByArg.Desc },
      pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
    }
  });
  const questionsByEventQueryArchive = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      reviewStatus: [ReviewStatus.Archive],
      // orderBy: { createdAt: OrderByArg.Desc },
      pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
    }
  });
  const questionsByEventQuerySearch = useQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      reviewStatus: [ReviewStatus.Publish, ReviewStatus.Archive],
      searchString: searchState[0]?.value,
      // orderBy: { createdAt: OrderByArg.Desc },
      pagination: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_OFFSET
      }
    }
  });

  // subscriptions
  const getReviewStatusById = (id: string): ReviewStatus | undefined => {
    if (
      questionsByEventQueryReview.data?.questionsByEvent.list.find(
        item => item.id === id
      )
    ) {
      return ReviewStatus.Review;
    } else if (
      questionsByEventQuery.data?.questionsByEvent.list.find(
        item => item.id === id
      )
    ) {
      return ReviewStatus.Publish;
    } else if (
      questionsByEventQueryArchive.data?.questionsByEvent.list.find(
        item => item.id === id
      )
    ) {
      return ReviewStatus.Archive;
    }
  };
  const getPrev = (
    reviewStatus: ReviewStatus
  ): QuestionsByEventQuery | undefined => {
    switch (reviewStatus) {
      case ReviewStatus.Review:
        return questionsByEventQueryReview.data;
      case ReviewStatus.Publish:
        return questionsByEventQuery.data;
      case ReviewStatus.Archive:
        return questionsByEventQueryArchive.data;
    }
  };
  const updateCache = (
    cache: DataProxy,
    eventId: string,
    reviewStatus: ReviewStatus,
    data: QuestionsByEventQuery
  ) => {
    cache.writeQuery<
      QuestionsByEventQuery,
      Omit<QuestionsByEventQueryVariables, "pagination">
    >({
      query: QuestionsByEventDocument,
      variables: {
        eventId,
        reviewStatus: [reviewStatus],
        searchString: ""
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
        const reviewStatus = getReviewStatusById(questionRemoved);
        if (reviewStatus) {
          const prev = getPrev(reviewStatus);

          if (prev) {
            // remove
            updateCache(client, id as string, reviewStatus, {
              questionsByEvent: {
                ...prev.questionsByEvent,
                totalCount: prev.questionsByEvent.totalCount - 1,
                list: prev.questionsByEvent.list.filter(
                  preQuestion => questionRemoved !== preQuestion.id
                )
              }
            });
          }
        }
      }
    }
  });

  return (
    <Grid container spacing={3} className={classes.questionsGrid}>
      <Grid item sm={6} className={classes.gridItem}>
        <Box className={classes.listActions}>
          <ActionReview eventQuery={eventQuery} updateCache={updateCache} />
        </Box>
        <Paper className={classes.gridItemPaper}>
          {eventData?.eventById.moderation ? (
            <QuestionList
              eventQuery={eventQuery}
              questionsByEventQuery={questionsByEventQueryReview}
            />
          ) : (
            <Box className={classes.moderationOffTips}>
              <Typography variant="h6" align="center" paragraph>
                <FormattedMessage
                  id="Moderation_is_off"
                  defaultMessage="Moderation is off"
                />
              </Typography>
              <Typography align="center">
                <FormattedMessage
                  id="Incoming_questions_will_automatically_appear_live."
                  defaultMessage="Incoming questions will automatically appear live."
                />
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
      <Grid item sm={6} className={classes.gridItem}>
        <Box className={classes.listActions}>
          <ActionRight
            tabIndexState={tabIndexState}
            searchState={searchState}
          />
        </Box>
        <Paper className={classes.gridItemPaper}>
          <QuestionList
            eventQuery={eventQuery}
            questionsByEventQuery={
              searchState[0].active
                ? questionsByEventQuerySearch
                : tabIndexState[0] === 0
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
