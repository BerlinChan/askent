import React from "react";
import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  FormattedMessage,
  FormattedDate,
  FormattedTime
} from "react-intl";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { QueryResult } from "@apollo/react-common";
import {
  Question,
  EventQuery,
  EventQueryVariables,
  useUpdateQuestionMutation
} from "../../../generated/graphqlHooks";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import StarIcon from "@material-ui/icons/Star";
import TopIcon from "@material-ui/icons/Publish";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      flexWrap: "wrap",
      position: "relative",
      "&:hover .questionHover": {
        visibility: "visible"
      },
      "& .questionHover": {
        visibility: "hidden"
      }
    },
    questionMeta: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1)
    },
    questionContent: { width: "100%" },
    questionActionBox: {
      position: "absolute",
      top: 0,
      right: 8
    }
  })
);

interface Props {
  question: Pick<
    Question,
    | "id"
    | "updatedAt"
    | "voteCount"
    | "username"
    | "content"
    | "star"
    | "archived"
    | "published"
    | "top"
  >;
  eventQuery: QueryResult<EventQuery, EventQueryVariables>;
  handleMoreClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
}

const QuestionListItem: React.FC<Props> = ({
  question,
  handleMoreClick,
  eventQuery
}) => {
  const classes = useStyles();
  const { data: eventData } = eventQuery;
  const [updateQuestionMutation] = useUpdateQuestionMutation();

  const handleArchiveClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    archived: boolean
  ) => {
    await updateQuestionMutation({
      variables: { data: { questionId: id, archived: !archived } }
    });
  };
  const handleReviewClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    published: boolean
  ) => {
    await updateQuestionMutation({
      variables: { data: { questionId: id, published: !published } }
    });
  };
  const handleStarClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    star: boolean
  ) => {
    await updateQuestionMutation({
      variables: { data: { questionId: id, star: !star } }
    });
  };
  const handleTopClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    top: boolean
  ) => {
    await updateQuestionMutation({
      variables: { data: { questionId: id, top: !top } }
    });
  };

  return (
    <ListItem
      className={classes.listItem}
      alignItems="flex-start"
      divider
    >
      <ListItemAvatar>
        <Avatar src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography component="span" variant="body2" color="textPrimary">
            {question.username ? (
              question.username
            ) : (
              <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
            )}
          </Typography>
        }
        secondary={
          <React.Fragment>
            <ThumbUpIcon style={{ fontSize: 12 }} />
            <Typography
              className={classes.questionMeta}
              component="span"
              variant="body2"
              color="inherit"
            >
              {question.voteCount}
            </Typography>
            <AccessTimeIcon style={{ fontSize: 12 }} />
            <Typography
              className={classes.questionMeta}
              component="span"
              variant="body2"
              color="inherit"
            >
              <FormattedDate value={question.updatedAt} />
              {", "}
              <FormattedTime value={question.updatedAt} />
            </Typography>
          </React.Fragment>
        }
      />
      <Typography className={classes.questionContent} variant="body1">
        {question.content}
      </Typography>

      <Box className={classes.questionActionBox}>
        {question.published && (
          <IconButton
            className={"questionHover"}
            onClick={e => handleStarClick(e, question.id, question.star)}
          >
            <StarIcon
              fontSize="inherit"
              color={question.star ? "secondary" : "inherit"}
            />
          </IconButton>
        )}
        {question.published && !question.archived && (
          <IconButton
            className={"questionHover"}
            onClick={e => handleTopClick(e, question.id, question.top)}
          >
            <TopIcon
              fontSize="inherit"
              color={question.top ? "secondary" : "inherit"}
            />
          </IconButton>
        )}
        {eventData?.event.moderation && !question.archived && (
          <IconButton
            className={"questionHover"}
            onClick={e => handleReviewClick(e, question.id, question.published)}
          >
            {question.published ? (
              <ClearIcon fontSize="inherit" />
            ) : (
              <CheckIcon fontSize="inherit" />
            )}
          </IconButton>
        )}
        {question.published && (
          <IconButton
            className={"questionHover"}
            onClick={e => handleArchiveClick(e, question.id, question.archived)}
          >
            {question.archived ? (
              <UnarchiveIcon fontSize="inherit" />
            ) : (
              <ArchiveIcon fontSize="inherit" />
            )}
          </IconButton>
        )}
        <IconButton size="small" onClick={e => handleMoreClick(e, question.id)}>
          <MoreHorizIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default QuestionListItem;
