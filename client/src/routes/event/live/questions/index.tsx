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
  LiveEventQuery,
  LiveEventQueryVariables,
  LiveQuestionsByEventQuery,
  LiveQuestionsByEventQueryVariables,
  useLiveQuestionsByEventQuery,
  useLiveQuestionAddedSubscription,
  useLiveQuestionUpdatedSubscription,
  useLiveQuestionRemovedSubscription,
  LiveQuestionsByEventDocument,
  RoleName
} from "../../../../generated/graphqlHooks";
import Logo from "../../../../components/Logo";
import QuestionList from "./QuestionList";

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
  eventQueryResult: QueryResult<LiveEventQuery, LiveEventQueryVariables>;
}

const LiveQuestions: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  let { id } = useParams();
  const liveQuestionsResult = useLiveQuestionsByEventQuery({
    variables: { eventId: id as string }
  });
  const [tabIndex, setTabIndex] = React.useState(0);

  // subscriptions
  useLiveQuestionAddedSubscription({
    variables: { eventId: id as string, role: RoleName.Audience },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const questions = client.readQuery<
        LiveQuestionsByEventQuery,
        LiveQuestionsByEventQueryVariables
      >({
        query: LiveQuestionsByEventDocument,
        variables: { eventId: id as string }
      });

      // add
      client.writeQuery<
        LiveQuestionsByEventQuery,
        LiveQuestionsByEventQueryVariables
      >({
        query: LiveQuestionsByEventDocument,
        variables: { eventId: id as string },
        data: {
          liveQuestionsByEvent: (subscriptionData.data?.questionAdded
            ? [subscriptionData.data?.questionAdded]
            : []
          ).concat(
            (questions?.liveQuestionsByEvent || []).filter(
              question =>
                question.id !== subscriptionData.data?.questionAdded.id
            )
          )
        }
      });
    }
  });
  useLiveQuestionUpdatedSubscription({
    variables: { eventId: id as string },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const questions = client.readQuery<
        LiveQuestionsByEventQuery,
        LiveQuestionsByEventQueryVariables
      >({
        query: LiveQuestionsByEventDocument,
        variables: { eventId: id as string }
      });

      const shouldReplace = (
        subscriptionData.data?.questionsUpdated || []
      ).filter(
        question =>
          !question.archived &&
          (question.published ||
            question.author?.id === userQueryResult.data?.me.id)
      );
      const deduplicated = R.without(
        subscriptionData.data?.questionsUpdated || [],
        questions?.liveQuestionsByEvent || []
      );
      const concat = R.concat(shouldReplace || [], deduplicated);

      // update
      client.writeQuery<
        LiveQuestionsByEventQuery,
        LiveQuestionsByEventQueryVariables
      >({
        query: LiveQuestionsByEventDocument,
        variables: { eventId: id as string },
        data: { liveQuestionsByEvent: concat }
      });
    }
  });
  useLiveQuestionRemovedSubscription({
    variables: { eventId: id as string },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const questions = client.readQuery<
        LiveQuestionsByEventQuery,
        LiveQuestionsByEventQueryVariables
      >({
        query: LiveQuestionsByEventDocument,
        variables: { eventId: id as string }
      });

      // remove
      client.writeQuery<
        LiveQuestionsByEventQuery,
        LiveQuestionsByEventQueryVariables
      >({
        query: LiveQuestionsByEventDocument,
        variables: { eventId: id as string },
        data: {
          liveQuestionsByEvent: R.without(
            subscriptionData.data?.questionsRemoved || [],
            questions?.liveQuestionsByEvent || []
          )
        }
      });
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
        <Box>
          <Typography color="textSecondary">
            {eventQueryResult.data?.eventById.liveQuestionCount}{" "}
            <FormattedMessage id="questions" defaultMessage="questions" />
          </Typography>
        </Box>
      </Box>
      <Paper className={classes.panelPaper}>
        <QuestionList
          userQueryResult={userQueryResult}
          eventQueryResult={eventQueryResult}
          liveQuestionsResult={liveQuestionsResult}
          comparator={
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
