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
  Button
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
import {
  useIntl,
  FormattedMessage,
  FormattedDate,
  FormattedTime
} from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  QuestionFieldsFragment,
  AdminEventQuery,
  AdminEventQueryVariables,
  useUpdateQuestionMutation,
  QuestionReviewStatus
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
  handleToggleType
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
      "& .questionHover": { display: "none" }
    },
    starQuestion: {
      backgroundColor: fade(theme.palette.warning.light, 0.3)
    },
    topQuestion: {
      backgroundColor: fade(theme.palette.success.light, 0.3)
    },
    questionMeta: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1)
    },
    questionContent: { width: "100%" },
    editContentForm: { width: "100%" },
    editContentAction: { display: "flex", justifyContent: "space-between" },
    editContentFormButtons: { "& > *": { display: "inline-block" } },
    questionActionBox: {
      position: "absolute",
      display: "flex",
      top: 0,
      right: 8,
      height: 48
    }
  })
);

interface Props {
  question: QuestionFieldsFragment;
  eventQuery: QueryResult<AdminEventQuery, AdminEventQueryVariables>;
  handleMoreClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  editContent: boolean;
  handleEditContentToggle: (id: string) => void;
  editContentInputRef: React.RefObject<HTMLInputElement>;
}

const QuestionListItem: React.FC<Props> = ({
  question,
  handleMoreClick,
  eventQuery,
  editContent,
  handleEditContentToggle,
  editContentInputRef
}) => {
  const classes = useStyles();
  const { data } = eventQuery;
  const { formatMessage } = useIntl();
  const [
    updateQuestionMutation,
    { loading: updateQuestionLoading }
  ] = useUpdateQuestionMutation();

  const handleArchiveClick: handleToggleType = async (e, id, currentStatus) => {
    await updateQuestionMutation({
      variables: {
        input: {
          questionId: id,
          reviewStatus: currentStatus
            ? QuestionReviewStatus.Publish
            : QuestionReviewStatus.Archive
        }
      }
    });
  };
  const handlePublishClick: handleToggleType = async (e, id, currentStatus) => {
    await updateQuestionMutation({
      variables: {
        input: {
          questionId: id,
          reviewStatus: currentStatus
            ? QuestionReviewStatus.Review
            : QuestionReviewStatus.Publish
        }
      }
    });
  };
  const handleStarClick: handleToggleType = async (e, id, star) => {
    await updateQuestionMutation({
      variables: { input: { questionId: id, star: !star } }
    });
  };
  const handleTopClick: handleToggleType = async (e, id, top) => {
    await updateQuestionMutation({
      variables: { input: { questionId: id, top: !top } }
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
            src="/static/images/avatar/1.jpg"
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
                {question.voteCount}
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
              content: Yup.string()
                .max(QUESTION_CONTENT_MAX_LENGTH)
                .required()
            })}
            onSubmit={async values => {
              await updateQuestionMutation({
                variables: {
                  input: { questionId: question.id, content: values.content }
                }
              });
              handleEditContentToggle(question.id);
            }}
          >
            {formProps => (
              <Form className={classes.editContentForm}>
                <Field
                  component={TextField}
                  inputRef={editContentInputRef}
                  fullWidth
                  id="content"
                  name="content"
                  margin="normal"
                  size="small"
                  disabled={updateQuestionLoading}
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
                      loading={updateQuestionLoading}
                      disabled={updateQuestionLoading}
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
            <Box className={classes.questionActionBox}>
              {(question.reviewStatus === QuestionReviewStatus.Publish ||
                question.reviewStatus === QuestionReviewStatus.Archive) && (
                <QuestionToggleButton
                  className="questionHover"
                  id={question.id}
                  status={question.star}
                  onTitle={formatMessage({
                    id: "Unstar",
                    defaultMessage: "Unstar"
                  })}
                  offTitle={formatMessage({
                    id: "Star",
                    defaultMessage: "Star"
                  })}
                  onIcon={<StarIcon fontSize="inherit" color="secondary" />}
                  offIcon={<StarIcon fontSize="inherit" color="inherit" />}
                  handleToggle={handleStarClick}
                />
              )}
              {question.reviewStatus === QuestionReviewStatus.Publish && (
                <QuestionToggleButton
                  className="questionHover"
                  id={question.id}
                  status={question.top}
                  onTitle={formatMessage({
                    id: "Untop",
                    defaultMessage: "Untop"
                  })}
                  offTitle={formatMessage({ id: "Top", defaultMessage: "Top" })}
                  onIcon={<TopIcon fontSize="inherit" color="secondary" />}
                  offIcon={<TopIcon fontSize="inherit" color="inherit" />}
                  handleToggle={handleTopClick}
                />
              )}
              {data?.eventById.moderation &&
                (question.reviewStatus === QuestionReviewStatus.Publish ||
                  question.reviewStatus === QuestionReviewStatus.Review) && (
                  <QuestionToggleButton
                    className="questionHover"
                    id={question.id}
                    status={
                      question.reviewStatus === QuestionReviewStatus.Publish
                    }
                    onTitle={formatMessage({
                      id: "Unpublish",
                      defaultMessage: "Unpublish"
                    })}
                    offTitle={formatMessage({
                      id: "Publish",
                      defaultMessage: "Publish"
                    })}
                    onIcon={<ClearIcon fontSize="inherit" />}
                    offIcon={<CheckIcon fontSize="inherit" />}
                    handleToggle={handlePublishClick}
                  />
                )}
              {(question.reviewStatus === QuestionReviewStatus.Publish ||
                question.reviewStatus === QuestionReviewStatus.Archive) && (
                <QuestionToggleButton
                  className="questionHover"
                  id={question.id}
                  status={
                    question.reviewStatus === QuestionReviewStatus.Archive
                  }
                  onTitle={formatMessage({
                    id: "Unarchive",
                    defaultMessage: "Unarchive"
                  })}
                  offTitle={formatMessage({
                    id: "Archive",
                    defaultMessage: "Archive"
                  })}
                  onIcon={<UnarchiveIcon fontSize="inherit" />}
                  offIcon={<ArchiveIcon fontSize="inherit" />}
                  handleToggle={handleArchiveClick}
                />
              )}

              <IconButton
                size="small"
                onClick={e => handleMoreClick(e, question.id)}
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
