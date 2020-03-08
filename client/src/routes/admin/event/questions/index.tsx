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
import ActionRight, {
  QuestionQueryStateType,
  questionFilterOptions,
  questionOrderOptions
} from "./ActionRight";
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
      flexWrap: "nowrap"
    },
    gridItemPaper: {
      flex: 1,
      overflowX: "hidden",
      overflowY: "auto"
    },
    rightPaper: {
      borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`
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
  const questionQueryState = React.useState<QuestionQueryStateType>({
    filterOptionIndexes: [0],
    searchString: "",
    orderOptionIndex: 0
  });
  const { data: eventData } = eventQuery;
  const questionQueryVariables = {
    eventId: id as string,
    reviewStatus: questionQueryState[0].filterOptionIndexes
      .filter(filterOptionIndex => filterOptionIndex < 2) // only ReviewStatus type
      .map(
        filterOptionIndex =>
          questionFilterOptions[filterOptionIndex].value as ReviewStatus
      ),
    searchString: questionQueryState[0].searchString
      ? questionQueryState[0].searchString
      : undefined,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
    order: questionOrderOptions[questionQueryState[0].orderOptionIndex].value
  };
  const questionReviewQueryVariables = {
    eventId: id as string,
    reviewStatus: [ReviewStatus.Review],
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
  };
  const questionsByEventQuery = useQuestionsByEventQuery({
    variables: questionQueryVariables
  });
  const questionsByEventQueryReview = useQuestionsByEventQuery({
    variables: questionReviewQueryVariables
  });

  // subscriptions
  const getPrevData = (
    reviewStatus: ReviewStatus | null
  ): QuestionsByEventQuery | undefined => {
    switch (reviewStatus) {
      case ReviewStatus.Review:
        return questionsByEventQueryReview.data;
      default:
        return questionsByEventQuery.data;
    }
  };
  const updateCache = (
    cache: DataProxy,
    reviewStatus: ReviewStatus | null,
    data: QuestionsByEventQuery
  ) => {
    cache.writeQuery<
      QuestionsByEventQuery,
      Omit<QuestionsByEventQueryVariables, "pagination">
    >({
      query: QuestionsByEventDocument,
      variables:
        reviewStatus === ReviewStatus.Review
          ? questionReviewQueryVariables
          : questionQueryVariables,
      data
    });
  };
  useQuestionAddedSubscription({
    variables: { eventId: id as string, role: RoleName.Admin },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;
        const prevData = getPrevData(questionAdded.reviewStatus);

        if (prevData) {
          // add
          updateCache(client, questionAdded.reviewStatus, {
            questionsByEvent: {
              ...prevData.questionsByEvent,
              totalCount: prevData.questionsByEvent.totalCount + 1,
              list: [questionAdded].concat(
                prevData.questionsByEvent.list.filter(
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
        const prevData = getPrevData(null);

        if (prevData) {
          // remove
          updateCache(client, null, {
            questionsByEvent: {
              ...prevData.questionsByEvent,
              totalCount: prevData.questionsByEvent.totalCount - 1,
              list: prevData.questionsByEvent.list.filter(
                preQuestion => questionRemoved !== preQuestion.id
              )
            }
          });
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
            questionQueryState={questionQueryState}
            questionsQueryResult={questionsByEventQuery}
          />
        </Box>
        <Paper className={classes.gridItemPaper + " " + classes.rightPaper}>
          <QuestionList
            eventQuery={eventQuery}
            questionsByEventQuery={questionsByEventQuery}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Questions;
