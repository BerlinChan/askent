import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from "@material-ui/core";
import { FormattedMessage, FormattedTime, FormattedDate } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { QueryResult } from "@apollo/react-common";
import {
  LiveEventQuery,
  LiveEventQueryVariables,
  useVoteQuestionMutation
} from "../../../generated/graphqlHooks";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {},
    listItem: {
      flexWrap: "wrap",
      position: "relative"
    },
    questionContent: { width: "100%" },
    questionActionBox: {
      position: "absolute",
      top: 0,
      right: 8
    },
    thumbUpButton: {
      height: 24,
      padding: theme.spacing(0, 1),
      borderRadius: 12
    },
    voteCount: {
      fontSize: 12
    },
    thumbUpIcon: {
      fontSize: 12,
      marginLeft: theme.spacing(1)
    }
  })
);

interface Props {
  eventQueryResult: QueryResult<LiveEventQuery, LiveEventQueryVariables>;
}

const QuestionList: React.FC<Props> = ({ eventQueryResult }) => {
  const classes = useStyles();
  const [
    voteQuestionMutation,
    { loading: voteLoading }
  ] = useVoteQuestionMutation();

  const handleThumbUpClick = (questionId: string) => {
    voteQuestionMutation({ variables: { questionId } });
  };

  return (
    <List className={classes.list} disablePadding>
      {eventQueryResult.data?.eventById.questionsForLive.map(
        (question, index) => (
          <ListItem
            key={index}
            className={classes.listItem}
            alignItems="flex-start"
            divider
          >
            <ListItemAvatar>
              <Avatar
                alt={question.author?.name as string}
                src="/static/images/avatar/1.jpg"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" color="textPrimary">
                  {question.author?.name ? (
                    question.author?.name
                  ) : (
                    <FormattedMessage
                      id="Anonymous"
                      defaultMessage="Anonymous"
                    />
                  )}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  <FormattedDate value={question.updatedAt} />
                  {", "}
                  <FormattedTime value={question.updatedAt} />
                </Typography>
              }
            />
            <Typography className={classes.questionContent} variant="body1">
              {question.content}
            </Typography>
            <Box className={classes.questionActionBox}>
              <Button
                variant="outlined"
                color={question.voted ? "primary" : "default"}
                classes={{ root: classes.thumbUpButton }}
                disabled={voteLoading}
                onClick={() => handleThumbUpClick(question.id)}
              >
                <Typography color="inherit" className={classes.voteCount}>
                  {question.voteCount}
                </Typography>
                <ThumbUpIcon color="inherit" className={classes.thumbUpIcon} />
              </Button>
            </Box>
          </ListItem>
        )
      )}
    </List>
  );
};

export default QuestionList;
