import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
} from "@material-ui/core";
import {
  FormattedMessage,
  FormattedTime,
  FormattedDate,
  useIntl,
} from "react-intl";
import {
  createStyles,
  makeStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";
import { QueryResult } from "@apollo/client";
import {
  MeQuery,
  MeQueryVariables,
  useVoteUpQuestionMutation,
  useUpdateQuestionContentMutation,
  ReviewStatus,
} from "../../../../generated/graphqlHooks";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TopIcon from "@material-ui/icons/Publish";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../../components/Form";
import { QUESTION_CONTENT_MAX_LENGTH } from "askent-common/src/constant";
import { TextField } from "formik-material-ui";
import { QuestionLiveQueryAudienceFieldsFragment } from "../../../../generated/hasuraHooks";
import { ReplyDialogStateType } from "./reply/ReplyDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      flexWrap: "wrap",
      position: "relative",
      maxWidth: theme.breakpoints.values.sm,
      marginLeft: "auto",
      marginRight: "auto",
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
    },
    listItemShadow: {
      boxShadow: theme.shadows[1],
    },
    topQuestion: {
      backgroundColor: alpha(theme.palette.success.light, 0.5),
    },
    questionContent: { width: "100%" },
    reply: { cursor: "pointer" },
    moreButton: { float: "right" },
    questionActionBox: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      "& > *": { marginLeft: theme.spacing(1) },
    },
    thumbUpButton: {
      height: 24,
      padding: theme.spacing(0, 1),
      borderRadius: 12,
    },
    voteCount: {
      fontSize: 12,
    },
    thumbUpIcon: {
      fontSize: 12,
      marginLeft: theme.spacing(1),
    },
    editContentForm: { width: "100%" },
    editContentAction: { display: "flex", justifyContent: "space-between" },
    editContentFormButtons: { "& > *": { display: "inline-block" } },
  })
);

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  question: QuestionLiveQueryAudienceFieldsFragment;
  handleMoreClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  editContent: boolean;
  handleEditContentToggle: (id: string) => void;
  editContentInputRef: React.RefObject<HTMLInputElement>;
  isScrolling?: boolean;
  disableItemShadow?: boolean;
  disableVote?: boolean;
  showReplyCount?: boolean;
  replyDialogState?: [
    ReplyDialogStateType,
    React.Dispatch<React.SetStateAction<ReplyDialogStateType>>
  ];
}

const QuestionItem: React.FC<Props> = ({
  userQueryResult,
  question,
  handleMoreClick,
  editContent,
  handleEditContentToggle,
  editContentInputRef,
  isScrolling = false,
  disableItemShadow = false,
  disableVote = false,
  showReplyCount = true,
  replyDialogState,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [voteUpQuestionMutation, { loading: voteLoading }] =
    useVoteUpQuestionMutation();
  const [
    updateQuestionContentMutation,
    { loading: updateQuestionContentLoading },
  ] = useUpdateQuestionContentMutation();

  const handleThumbUpClick = (questionId: string) => {
    voteUpQuestionMutation({ variables: { questionId } });
  };

  const handleOpenReply = () => {
    if (replyDialogState) {
      replyDialogState[1]({ open: true, questionId: question.id });
    }
  };

  return (
    <ListItem
      component="div"
      className={`${classes.listItem} ${
        disableItemShadow ? "" : classes.listItemShadow
      } ${question.top ? classes.topQuestion : ""}`}
      alignItems="flex-start"
    >
      <ListItemAvatar>
        <Avatar
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
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2" color="textPrimary">
            {!question.anonymous && question.author?.name ? (
              question.author?.name
            ) : (
              <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
            )}
          </Typography>
        }
        secondary={
          <React.Fragment>
            <FormattedDate value={question.createdAt} />
            {", "}
            <FormattedTime value={question.createdAt} />
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
            <IconButton
              className={classes.moreButton}
              size="small"
              onClick={(e) => handleMoreClick(e, question.id)}
            >
              <MoreHorizIcon fontSize="inherit" />
            </IconButton>
          </Typography>
          {showReplyCount && Boolean(question.replyCount) && (
            <Typography
              className={classes.reply}
              variant="body2"
              color="textSecondary"
              onClick={handleOpenReply}
            >
              <FormattedMessage
                id="replyCount"
                defaultMessage="{num, plural, one {# reply} other {# replies}}"
                values={{ num: question.replyCount }}
              />
            </Typography>
          )}
          <Box className={classes.questionActionBox}>
            {question.reviewStatus === ReviewStatus.Review && (
              <Tooltip
                title={formatMessage({
                  id: "Waiting_review",
                  defaultMessage: "Waiting review",
                })}
              >
                <ScheduleIcon fontSize="small" color="disabled" />
              </Tooltip>
            )}
            {question.top && (
              <Tooltip
                title={formatMessage({ id: "Top", defaultMessage: "Top" })}
              >
                <TopIcon fontSize="small" color="disabled" />
              </Tooltip>
            )}
            {!disableVote && (
              <Button
                variant="outlined"
                color={
                  question.voteUpUsers.length &&
                  question.voteUpUsers[0].userId === userQueryResult.data?.me.id
                    ? "primary"
                    : "default"
                }
                classes={{ root: classes.thumbUpButton }}
                disabled={voteLoading}
                onClick={() => handleThumbUpClick(question.id)}
              >
                <Typography color="inherit" className={classes.voteCount}>
                  {question.voteUpCount}
                </Typography>
                <ThumbUpIcon color="inherit" className={classes.thumbUpIcon} />
              </Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </ListItem>
  );
};

export default QuestionItem;
