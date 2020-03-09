import React from "react";
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
  QuestionsByEventAudienceQuery,
  QuestionsByEventAudienceQueryVariables,
  useQuestionsByEventAudienceQuery,
  useQuestionAddedAudienceSubscription,
  useQuestionUpdatedAudienceSubscription,
  useQuestionRemovedAudienceSubscription,
  QuestionsByEventAudienceDocument,
  RoleName,
  QuestionOrder
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
  const [orderTab, setOrderTab] = React.useState<QuestionOrder>(
    QuestionOrder.Popular
  );
  const questionsQueryResult = useQuestionsByEventAudienceQuery({
    variables: {
      eventId: id as string,
      // orderBy:
      //   orderTab === 0
      //     ? { createdAt: OrderByArg.Desc } // TODO: cant orderBy voteCount
      //     : orderTab === 0
      //     ? { createdAt: OrderByArg.Desc }
      //     : undefined,
      pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
    }
  });

  // subscriptions
  const updateCache = (
    cache: DataProxy,
    eventId: string,
    data: QuestionsByEventAudienceQuery
  ) => {
    cache.writeQuery<
      QuestionsByEventAudienceQuery,
      Omit<QuestionsByEventAudienceQueryVariables, "pagination">
    >({
      query: QuestionsByEventAudienceDocument,
      variables: { eventId },
      data
    });
  };
  useQuestionAddedAudienceSubscription({
    variables: { eventId: id as string, role: RoleName.Audience },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;
        const prev = questionsQueryResult.data;

        if (prev) {
          // add
          updateCache(client, id as string, {
            questionsByEventAudience: {
              ...prev.questionsByEventAudience,
              totalCount: prev.questionsByEventAudience.totalCount + 1,
              list: [questionAdded].concat(
                prev.questionsByEventAudience.list.filter(
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
  useQuestionUpdatedAudienceSubscription({
    variables: { eventId: id as string, role: RoleName.Audience }
  });
  useQuestionRemovedAudienceSubscription({
    variables: { eventId: id as string, role: RoleName.Audience },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const prev = questionsQueryResult.data;

      if (prev) {
        // remove
        updateCache(client, id as string, {
          questionsByEventAudience: {
            ...prev.questionsByEventAudience,
            totalCount: prev.questionsByEventAudience.totalCount - 1,
            list: prev.questionsByEventAudience.list.filter(
              preQuestion =>
                subscriptionData.data?.questionRemoved !== preQuestion.id
            )
          }
        });
      }
    }
  });

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setOrderTab(newValue === 0 ? QuestionOrder.Popular : QuestionOrder.Recent);
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
        <SubTabs value={orderTab} onChange={handleTabsChange}>
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
          {questionsQueryResult.data?.questionsByEventAudience.totalCount}{" "}
          <FormattedMessage id="questions" defaultMessage="questions" />
        </Typography>
      </Box>
      <Paper className={classes.panelPaper}>
        <QuestionList
          userQueryResult={userQueryResult}
          eventQueryResult={eventQueryResult}
          questionsQueryResult={questionsQueryResult}
          order={orderTab}
        />
      </Paper>
      <Box className={classes.bottomLogoBox}>
        <Logo />
      </Box>
    </Container>
  );
};

export default LiveQuestions;
