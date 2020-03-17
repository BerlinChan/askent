import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Hidden } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";
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
import QuestionList from "./QuestionList";
import AskFabDialog from "./AskFabDialog";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../../constant";
import { VirtuosoMethods } from "react-virtuoso";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    questionForm: { marginBottom: theme.spacing(2) },
    title: {
      marginTop: theme.spacing(1),
      marginDown: theme.spacing(1)
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
  let { id } = useParams();
  const virtuosoRef = React.useRef<VirtuosoMethods>(null);
  const questionsQueryVariables = {
    eventId: id as string,
    order: QuestionOrder.Popular,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
  };
  const questionsQueryResult = useQuestionsByEventAudienceQuery({
    variables: questionsQueryVariables
  });

  // subscriptions
  const updateCache = (
    cache: DataProxy,
    data: QuestionsByEventAudienceQuery
  ) => {
    cache.writeQuery<
      QuestionsByEventAudienceQuery,
      Omit<QuestionsByEventAudienceQueryVariables, "pagination">
    >({
      query: QuestionsByEventAudienceDocument,
      variables: questionsQueryVariables,
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
          updateCache(client, {
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
        updateCache(client, {
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

  const renderListHeader = (
    <Hidden smDown>
      <React.Fragment>
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
        <QuestionForm
          className={classes.questionForm}
          userQueryResult={userQueryResult}
          onFocus={() => {
            virtuosoRef.current?.scrollToIndex({
              index: 0,
              align: "start"
            });
          }}
        />
      </React.Fragment>
    </Hidden>
  );

  return (
    <React.Fragment>
      <QuestionList
        header={renderListHeader}
        userQueryResult={userQueryResult}
        eventQueryResult={eventQueryResult}
        questionsQueryResult={questionsQueryResult}
        order={questionsQueryVariables.order}
        ref={virtuosoRef}
      />

      <AskFabDialog userQueryResult={userQueryResult} />
    </React.Fragment>
  );
};

export default LiveQuestions;
