import React from "react";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { Box, Typography, Container, Paper } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";
import { SubTabs, SubTab } from "../../../../components/Tabs";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  LiveQuestionsByEventQuery,
  LiveQuestionsByEventQueryVariables,
  useLiveQuestionsByEventLazyQuery,
  useLiveQuestionAddedSubscription,
  useLiveQuestionUpdatedSubscription,
  useLiveQuestionRemovedSubscription,
  LiveQuestionsByEventDocument,
  RoleName,
} from "../../../../generated/graphqlHooks";
import { DataProxy } from "apollo-cache";
import Logo from "../../../../components/Logo";
import QuestionList from "./QuestionList";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(1),
      marginDown: theme.spacing(1)
    },
    listActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      marginTop: theme.spacing(1)
    },
    panelPaper: {},
    bottomLogoBox: {
      textAlign: "center",
      margin: theme.spacing(2)
    }
  })
);

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const LiveQuestions: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  let { id } = useParams();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [
    liveQuestionsByEventLazyQuery,
    liveQuestionsResult
  ] = useLiveQuestionsByEventLazyQuery();

  React.useEffect(() => {
    liveQuestionsByEventLazyQuery({
      variables: {
        eventId: id as string,
        // orderBy:
        //   tabIndex === 0
        //     ? { createdAt: OrderByArg.Desc } // TODO: cant orderBy voteCount
        //     : tabIndex === 0
        //     ? { createdAt: OrderByArg.Desc }
        //     : undefined,
        pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tabIndex]);

  // subscriptions
  const updateCache = (
    cache: DataProxy,
    eventId: string,
    data: LiveQuestionsByEventQuery
  ) => {
    cache.writeQuery<
      LiveQuestionsByEventQuery,
      Omit<LiveQuestionsByEventQueryVariables, "pagination">
    >({
      query: LiveQuestionsByEventDocument,
      variables: { eventId },
      data
    });
  };
  useLiveQuestionAddedSubscription({
    variables: { eventId: id as string, role: RoleName.Audience },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;
        const prev = liveQuestionsResult.data;

        if (prev) {
          // add
          updateCache(client, id as string, {
            liveQuestionsByEvent: {
              ...prev.liveQuestionsByEvent,
              totalCount: prev.liveQuestionsByEvent.totalCount + 1,
              list: [questionAdded].concat(
                prev.liveQuestionsByEvent.list.filter(
                  question =>
                    question.id !== subscriptionData.data?.questionAdded.id
                )
              )
            }
          });
        }
      }
    }
  });
  useLiveQuestionUpdatedSubscription({
    variables: { eventId: id as string, role: RoleName.Audience }
  });
  useLiveQuestionRemovedSubscription({
    variables: { eventId: id as string, role: RoleName.Audience },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const prev = liveQuestionsResult.data;

      if (prev) {
        // remove
        updateCache(client, id as string, {
          liveQuestionsByEvent: {
            ...prev.liveQuestionsByEvent,
            totalCount: prev.liveQuestionsByEvent.totalCount - 1,
            list: prev.liveQuestionsByEvent.list.filter(
              preQuestion =>
                subscriptionData.data?.questionRemoved !== preQuestion.id
            )
          }
        });
      }
    }
  });

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Typography
        variant="subtitle1"
        color="textSecondary"
        className={classes.title}
      >
        <FormattedMessage
          id="Ask_the_speaker"
          defaultMessage="Ask the speaker"
        />
      </Typography>
      <QuestionForm userQueryResult={userQueryResult} />
      <Box className={classes.listActions}>
        <SubTabs value={tabIndex} onChange={handleTabsChange}>
          <SubTab
            label={formatMessage({
              id: "Popular",
              defaultMessage: "Popular"
            })}
          />
          <SubTab
            label={formatMessage({
              id: "Recent",
              defaultMessage: "Recent"
            })}
          />
        </SubTabs>
        <Typography color="textSecondary">
          {liveQuestionsResult.data?.liveQuestionsByEvent.totalCount}{" "}
          <FormattedMessage id="questions" defaultMessage="questions" />
        </Typography>
      </Box>
      <Paper className={classes.panelPaper}>
        <QuestionList
          userQueryResult={userQueryResult}
          eventQueryResult={eventQueryResult}
          liveQuestionsResult={liveQuestionsResult}
          sortComparator={
            tabIndex === 0
              ? [R.descend(R.prop("voteCount"))]
              : tabIndex === 1
              ? [R.descend(R.prop("createdAt"))]
              : undefined
          }
        />
      </Paper>
      <Box className={classes.bottomLogoBox}>
        <Logo />
      </Box>
    </Container>
  );
};

export default LiveQuestions;
