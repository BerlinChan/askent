import React from "react";
import * as R from "ramda";
import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  Avatar,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useIntl, FormattedMessage } from "react-intl";
import {
  useUpdateQuestionReviewStatusMutation,
  useUpdateQuestionTopMutation,
  ReviewStatus,
} from "../../../generated/graphqlHooks";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import TopIcon from "@material-ui/icons/Publish";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import QuestionToggleButton, {
  handleToggleType,
} from "../../../components/QuestionToggleButton";
import { QuestionLiveQueryFieldsFragment } from "../../../generated/hasuraHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      flexWrap: "wrap",
      position: "relative",
      marginBottom: theme.typography.pxToRem(16),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: `${theme.palette.background.default}70`,
      "&:hover .questionHover": { opacity: 1 },
      "& .questionHover": {
        opacity: 0,
        transition: theme.transitions.create("opacity"),
      },
    },
    topQuestion: {
      backgroundColor: `${theme.palette.success[theme.palette.type]}90`,
    },
    itemPrimary: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      width: theme.typography.pxToRem(28),
      height: theme.typography.pxToRem(28),
      marginRight: theme.typography.pxToRem(12),
    },
    questionContent: {
      width: "100%",
      fontSize: theme.typography.pxToRem(28),
      marginTop: theme.typography.pxToRem(12),
      marginBottom: theme.typography.pxToRem(4),
    },
    questionActionBox: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      top: 0,
      right: theme.typography.pxToRem(16),
    },
    thumbUpBox: {
      display: "inline-flex",
      alignItems: "center",
      marginLeft: theme.typography.pxToRem(16),
    },
    voteCount: {
      fontSize: theme.typography.pxToRem(14),
    },
    thumbUpIcon: {
      fontSize: theme.typography.pxToRem(14),
      marginLeft: theme.typography.pxToRem(8),
    },
  })
);

interface Props {
  question: QuestionLiveQueryFieldsFragment;
  isScrolling?: boolean;
}

const QuestionListItem: React.FC<Props> = ({
  question,
  isScrolling = false,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [
    updateQuestionReviewStatusMutation,
    { loading: updateQuestionReviewStatusLoading },
  ] = useUpdateQuestionReviewStatusMutation();
  const [updateQuestionTopMutation, { loading: updateQuestionTopLoading }] =
    useUpdateQuestionTopMutation();

  const handleArchiveClick: handleToggleType = async (
    e,
    questionId,
    currentStatus
  ) => {
    await updateQuestionReviewStatusMutation({
      variables: {
        questionId,
        reviewStatus: currentStatus
          ? ReviewStatus.Publish
          : ReviewStatus.Archive,
      },
    });
  };
  const handleTopClick: handleToggleType = async (e, questionId, top) => {
    await updateQuestionTopMutation({
      variables: { questionId, top: !top },
    });
  };

  return (
    <ListItem
      component="div"
      className={`${classes.listItem} ${
        question.top ? classes.topQuestion : ""
      }`}
    >
      <React.Fragment>
        <ListItemText
          primary={
            <Box className={classes.itemPrimary}>
              <Avatar
                className={classes.avatar}
                alt={
                  !question.anonymous && question.author?.name
                    ? question.author?.name
                    : ""
                }
                src={
                  question.anonymous || isScrolling
                    ? ""
                    : (question.author?.avatar as string)
                }
              />
              <Typography component="span" variant="body1">
                {!question.anonymous && question.author?.name ? (
                  question.author?.name
                ) : (
                  <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
                )}
              </Typography>
            </Box>
          }
          secondary={
            <Typography className={classes.questionContent}>
              {question.content}
            </Typography>
          }
        />

        <Box className={classes.questionActionBox}>
          <QuestionToggleButton
            className="questionHover"
            id={question.id}
            status={question.top}
            disabled={updateQuestionTopLoading}
            onTitle={formatMessage({
              id: "Untop",
              defaultMessage: "Untop",
            })}
            offTitle={formatMessage({ id: "Top", defaultMessage: "Top" })}
            onIcon={<TopIcon fontSize="inherit" color="secondary" />}
            offIcon={<TopIcon fontSize="inherit" color="inherit" />}
            handleToggle={handleTopClick}
          />
          <QuestionToggleButton
            className="questionHover"
            id={question.id}
            status={question.reviewStatus === ReviewStatus.Archive}
            disabled={updateQuestionReviewStatusLoading}
            onTitle={formatMessage({
              id: "Unarchive",
              defaultMessage: "Unarchive",
            })}
            offTitle={formatMessage({
              id: "Archive",
              defaultMessage: "Archive",
            })}
            onIcon={<UnarchiveIcon fontSize="inherit" />}
            offIcon={<ArchiveIcon fontSize="inherit" />}
            handleToggle={handleArchiveClick}
          />
          <Box color="inherit" className={classes.thumbUpBox}>
            <Typography color="inherit" className={classes.voteCount}>
              {question.voteUpCount}
            </Typography>
            <ThumbUpIcon color="inherit" className={classes.thumbUpIcon} />
          </Box>
        </Box>
      </React.Fragment>
    </ListItem>
  );
};

export default React.memo(QuestionListItem, (prevProps, nextProps) => {
  return R.equals(prevProps, nextProps);
});
