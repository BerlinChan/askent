import React from "react";
import * as R from "ramda";
import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from "@material-ui/core/styles";
import {
  useIntl,
  FormattedMessage,
  FormattedDate,
  FormattedTime,
  FormattedPlural,
} from "react-intl";
import { QueryResult } from "@apollo/client";
import {
  QuestionFieldsFragment,
  EventByIdQuery,
  EventByIdQueryVariables,
  useUpdateQuestionReviewStatusMutation,
  useUpdateQuestionStarMutation,
  useUpdateQuestionTopMutation,
  useUpdateQuestionContentMutation,
  ReviewStatus,
} from "../../../../generated/graphqlHooks";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import StarIcon from "@material-ui/icons/Star";
import TopIcon from "@material-ui/icons/Publish";
import QuestionToggleButton, {
  handleToggleType,
} from "../../../../components/QuestionToggleButton";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../../components/Form";
import { QUESTION_CONTENT_MAX_LENGTH } from "../../../../constant";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      flexWrap: "wrap",
      position: "relative",
      "&:hover .questionHover": { display: "inline-flex" },
      "& .questionHover": { display: "none" },
    },
    starQuestion: {
      backgroundColor: fade(theme.palette.warning.light, 0.3),
    },
    topQuestion: {
      backgroundColor: fade(theme.palette.success.light, 0.3),
    },
    questionMeta: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1),
    },
    questionContent: { width: "100%" },
    editContentForm: { width: "100%" },
    editContentAction: { display: "flex", justifyContent: "space-between" },
    editContentFormButtons: { "& > *": { display: "inline-block" } },
    questionActionBox: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      top: 0,
      right: 8,
      height: 48,
    },
  })
);

interface Props {
  question: QuestionFieldsFragment;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  handleMoreClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  editContent: boolean;
  handleEditContentToggle: (id: string) => void;
  editContentInputRef: React.RefObject<HTMLInputElement>;
  isScrolling?: boolean;
}

const QuestionListItem: React.FC<Props> = ({
  question,
  handleMoreClick,
  eventQueryResult,
  editContent,
  handleEditContentToggle,
  editContentInputRef,
  isScrolling = false,
}) => {
  const classes = useStyles();
  const { data } = eventQueryResult;
  const { formatMessage } = useIntl();
  const [
    updateQuestionReviewStatusMutation,
    { loading: updateQuestionReviewStatusLoading },
  ] = useUpdateQuestionReviewStatusMutation();
  const [
    updateQuestionStarMutation,
    { loading: updateQuestionStarLoading },
  ] = useUpdateQuestionStarMutation();
  const [
    updateQuestionTopMutation,
    { loading: updateQuestionTopLoading },
  ] = useUpdateQuestionTopMutation();
  const [
    updateQuestionContentMutation,
    { loading: updateQuestionContentLoading },
  ] = useUpdateQuestionContentMutation();

  const handleArchiveClick: handleToggleType = async (e, id, currentStatus) => {
    await updateQuestionReviewStatusMutation({
      variables: {
        questionId: id,
        reviewStatus: currentStatus
          ? ReviewStatus.Publish
          : ReviewStatus.Archive,
      },
    });
  };
  const handlePublishClick: handleToggleType = async (e, id, currentStatus) => {
    await updateQuestionReviewStatusMutation({
      variables: {
        questionId: id,
        reviewStatus: currentStatus
          ? ReviewStatus.Review
          : ReviewStatus.Publish,
      },
    });
  };
  const handleStarClick: handleToggleType = async (e, id, star) => {
    await updateQuestionStarMutation({
      variables: { questionId: id, star: !star },
    });
  };
  const handleTopClick: handleToggleType = async (e, id, top) => {
    await updateQuestionTopMutation({
      variables: { questionId: id, top: !top },
    });
  };

  return (
    <ListItem
      component="div"
      className={`${classes.listItem} ${
        question.star ? classes.starQuestion : ""
      } ${question.top ? classes.topQuestion : ""}`}
      alignItems="flex-start"
      divider
    >
      <React.Fragment>
        <ListItemAvatar>
          <Avatar
            alt={question.author?.name as string}
            src={isScrolling ? "" : question.author?.avatar}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" variant="body2" color="textPrimary">
              {question.author?.name ? (
                question.author?.name
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
                {question.voteUpCount}
              </Typography>
              <AccessTimeIcon style={{ fontSize: 12 }} />
              <Typography
                className={classes.questionMeta}
                component="span"
                variant="body2"
                color="inherit"
              >
                <FormattedDate value={question.createdAt} />
                {", "}
                <FormattedTime value={question.createdAt} />
              </Typography>
            </React.Fragment>
          }
        />
        {editContent ? (
          <Formik
            initialValues={{ content: question.content }}
            validationSchema={Yup.object({
              content: Yup.string().max(QUESTION_CONTENT_MAX_LENGTH).required(),
            })}
            onSubmit={async (values) => {
              await updateQuestionContentMutation({
                variables: {
                  questionId: question.id,
                  content: values.content,
                },
              });
              handleEditContentToggle(question.id);
            }}
          >
            {(formProps) => (
              <Form className={classes.editContentForm}>
                <Field
                  component={TextField}
                  inputRef={editContentInputRef}
                  fullWidth
                  id="content"
                  name="content"
                  margin="normal"
                  size="small"
                  disabled={updateQuestionContentLoading}
                />
                <Box className={classes.editContentAction}>
                  <Typography
                    variant="body2"
                    color={
                      QUESTION_CONTENT_MAX_LENGTH -
                        formProps.values.content.length <
                      0
                        ? "error"
                        : "textSecondary"
                    }
                  >
                    {QUESTION_CONTENT_MAX_LENGTH -
                      formProps.values.content.length}
                  </Typography>
                  <Box className={classes.editContentFormButtons}>
                    <Button
                      size="small"
                      onClick={() => handleEditContentToggle(question.id)}
                    >
                      <FormattedMessage id="Cancel" defaultMessage="Cancel" />
                    </Button>
                    <ButtonLoading
                      size="small"
                      type="submit"
                      color="primary"
                      loading={updateQuestionContentLoading}
                      disabled={updateQuestionContentLoading}
                    >
                      <FormattedMessage id="Save" defaultMessage="Save" />
                    </ButtonLoading>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <React.Fragment>
            <Typography className={classes.questionContent} variant="body1">
              {question.content}
            </Typography>
            {Boolean(question.replyCount) && (
              <Typography variant="body2" color="textSecondary">
                {question.replyCount}{" "}
                <FormattedPlural
                  value={question.replyCount}
                  one="reply"
                  other="replies"
                />
              </Typography>
            )}
            <Box className={classes.questionActionBox}>
              {(question.reviewStatus === ReviewStatus.Publish ||
                question.reviewStatus === ReviewStatus.Archive) && (
                <QuestionToggleButton
                  className="questionHover"
                  id={question.id}
                  status={question.star}
                  onTitle={formatMessage({
                    id: "Unstar",
                    defaultMessage: "Unstar",
                  })}
                  offTitle={formatMessage({
                    id: "Star",
                    defaultMessage: "Star",
                  })}
                  onIcon={<StarIcon fontSize="inherit" color="secondary" />}
                  offIcon={<StarIcon fontSize="inherit" color="inherit" />}
                  disabled={updateQuestionStarLoading}
                  handleToggle={handleStarClick}
                />
              )}
              {question.reviewStatus === ReviewStatus.Publish && (
                <QuestionToggleButton
                  className="questionHover"
                  id={question.id}
                  status={question.top}
                  onTitle={formatMessage({
                    id: "Untop",
                    defaultMessage: "Untop",
                  })}
                  offTitle={formatMessage({ id: "Top", defaultMessage: "Top" })}
                  onIcon={<TopIcon fontSize="inherit" color="secondary" />}
                  offIcon={<TopIcon fontSize="inherit" color="inherit" />}
                  disabled={updateQuestionTopLoading}
                  handleToggle={handleTopClick}
                />
              )}
              {data?.eventById.moderation &&
                (question.reviewStatus === ReviewStatus.Publish ||
                  question.reviewStatus === ReviewStatus.Review) && (
                  <QuestionToggleButton
                    className="questionHover"
                    id={question.id}
                    status={question.reviewStatus === ReviewStatus.Publish}
                    onTitle={formatMessage({
                      id: "Unpublish",
                      defaultMessage: "Unpublish",
                    })}
                    offTitle={formatMessage({
                      id: "Publish",
                      defaultMessage: "Publish",
                    })}
                    onIcon={<ClearIcon fontSize="inherit" />}
                    offIcon={<CheckIcon fontSize="inherit" />}
                    disabled={updateQuestionReviewStatusLoading}
                    handleToggle={handlePublishClick}
                  />
                )}
              {(question.reviewStatus === ReviewStatus.Publish ||
                question.reviewStatus === ReviewStatus.Archive) && (
                <QuestionToggleButton
                  className="questionHover"
                  id={question.id}
                  status={question.reviewStatus === ReviewStatus.Archive}
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
                  disabled={updateQuestionReviewStatusLoading}
                  handleToggle={handleArchiveClick}
                />
              )}

              <IconButton
                size="small"
                onClick={(e) => handleMoreClick(e, question.id)}
              >
                <MoreHorizIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </React.Fragment>
        )}
      </React.Fragment>
    </ListItem>
  );
};

export default React.memo(QuestionListItem, (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return R.equals(prevProps, nextProps);
});
