import React from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, Box, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import {
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionFilter,
  QuestionOrder,
} from "../../../../generated/graphqlHooks";
import { QuestionLiveQuerySubscriptionVariables } from "../../../../generated/hasuraHooks";
import { QueryResult } from "@apollo/client";
import QuestionList from "./QuestionList";
import ActionReview from "./ActionReview";
import ActionRight, { QuestionQueryStateType } from "./ActionRight";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";
import { getQuestionOrderByCondition } from "../../../../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    questionsGrid: {
      height: "100%",
    },
    gridItem: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    listActions: {
      display: "flex",
      justifyContent: "space-between",
    },
    gridItemPaper: {
      flex: 1,
      overflowX: "hidden",
      overflowY: "auto",
    },
    rightPaper: {
      borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
    },
    moderationOffTips: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
    },
  })
);

interface Props {
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const Questions: React.FC<Props> = ({ eventQueryResult }) => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const questionQueryState = React.useState<QuestionQueryStateType>({
    filterSelected: QuestionFilter.Publish,
    searchString: "",
    limit: DEFAULT_PAGE_LIMIT,
    offset: DEFAULT_PAGE_OFFSET,
  });
  const questionReviewQueryState = React.useState<QuestionQueryStateType>({
    filterSelected: QuestionFilter.Publish,
    searchString: "",
    limit: DEFAULT_PAGE_LIMIT,
    offset: DEFAULT_PAGE_OFFSET,
  });
  const questionOrderSelectedState = React.useState(QuestionOrder.Popular);
  const { data: eventData } = eventQueryResult;
  const questionLiveQueryInput: QuestionLiveQuerySubscriptionVariables = {
    where: {
      eventId: { _eq: id },
      // reviewStatus:questionQueryState[0].filterSelected,
      content: { _ilike: `%${questionQueryState[0].searchString}%` },
    },
    limit: questionQueryState[0].limit,
    offset: questionQueryState[0].offset,
    order_by: getQuestionOrderByCondition(questionOrderSelectedState[0]),
  };
  const questionReviewLiveQueryInput: QuestionLiveQuerySubscriptionVariables = {
    where: {
      eventId: { _eq: id },
      reviewStatus: { _eq: QuestionFilter.Review },
    },
    limit: questionReviewQueryState[0].limit,
    offset: questionReviewQueryState[0].offset,
    order_by: getQuestionOrderByCondition(QuestionOrder.Oldest),
  };

  return (
    <Grid container spacing={3} className={classes.questionsGrid}>
      <Grid item sm={6} className={classes.gridItem}>
        <Box className={classes.listActions}>
          <ActionReview eventQueryResult={eventQueryResult} />
        </Box>
        <Paper className={classes.gridItemPaper}>
          {eventData?.eventById.moderation ? (
            <QuestionList
              eventQueryResult={eventQueryResult}
              questionQueryState={questionReviewQueryState}
              questionLiveQueryInput={questionReviewLiveQueryInput}
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
            orderSelectedState={questionOrderSelectedState}
          />
        </Box>
        <Paper className={classes.gridItemPaper + " " + classes.rightPaper}>
          <QuestionList
            eventQueryResult={eventQueryResult}
            questionQueryState={questionQueryState}
            questionLiveQueryInput={questionLiveQueryInput}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Questions;
