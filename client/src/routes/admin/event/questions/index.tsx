import React from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, Box, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import deepstreamClient from "../../../../deepstream";
import {
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionFilter,
  QuestionOrder
} from "../../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import QuestionList from "./QuestionList";
import ActionReview from "./ActionReview";
import ActionRight, { QuestionQueryStateType } from "./ActionRight";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";

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
      justifyContent: "space-between"
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
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const Questions: React.FC<Props> = ({ eventQueryResult }) => {
  const classes = useStyles();
  const { id } = useParams();
  const questionQueryState = React.useState<QuestionQueryStateType>({
    filterSelected: QuestionFilter.Publish,
    searchString: ""
  });
  const questionOrderSelectedState = React.useState(QuestionOrder.Popular);
  const { data: eventData } = eventQueryResult;
  const questionSearchInput = {
    eventId: id as string,
    questionFilter: questionQueryState[0].filterSelected,
    searchString: questionQueryState[0].searchString
      ? questionQueryState[0].searchString
      : undefined,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
    order: questionOrderSelectedState[0]
  };
  const questionSearchInputReview = {
    eventId: id as string,
    questionFilter: QuestionFilter.Review,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
    order: QuestionOrder.Oldest
  };

  React.useEffect(() => {
    deepstreamClient.rpc
      .make("question_realtime_search", questionSearchInput)
      .then(hash => {
        const resultList = deepstreamClient.record.getList(
          `question_realtime_search/list_${hash}`
        );
        resultList.subscribe(results => {
          console.log(">", results);
        });
      });
  });

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
              questionSearchInput={questionSearchInputReview}
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
            questionSearchInput={questionSearchInput}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Questions;
