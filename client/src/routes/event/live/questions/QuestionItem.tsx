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
  Tooltip
} from "@material-ui/core";
import {
  FormattedMessage,
  FormattedTime,
  FormattedDate,
  useIntl
} from "react-intl";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
import { QueryResult } from "@apollo/react-common";
import {
  MeAudienceQuery,
  MeAudienceQueryVariables,
  useVoteQuestionMutation,
  LiveQuestionFieldsFragment,
  useUpdateQuestionMutation
} from "../../../../generated/graphqlHooks";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TopIcon from "@material-ui/icons/Publish";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../../components/Form";
import { QUESTION_CONTENT_MAX_LENGTH } from "../../../../constant";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      flexWrap: "wrap",
      position: "relative"
    },
    topQuestion: {
      backgroundColor: fade(theme.palette.success.light, 0.5)
    },
    questionContent: { width: "100%" },
    moreButton: { float: "right" },
    questionActionBox: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      "& > *": { marginLeft: theme.spacing(1) }
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
    },
    editContentForm: { width: "100%" },
    editContentAction: { display: "flex", justifyContent: "space-between" },
    editContentFormButtons: { "& > *": { display: "inline-block" } }
  })
);

interface Props {
  userQueryResult: QueryResult<MeAudienceQuery, MeAudienceQueryVariables>;
  question: LiveQuestionFieldsFragment;
  handleMoreClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  editContent: boolean;
  handleEditContentToggle: (id: string) => void;
  editContentInputRef: React.RefObject<HTMLInputElement>;
}

const QuestionItem: React.FC<Props> = ({
  userQueryResult,
  question,
  handleMoreClick,
  editContent,
  handleEditContentToggle,
  editContentInputRef
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [
    voteQuestionMutation,
    { loading: voteLoading }
  ] = useVoteQuestionMutation();
  const [
    updateQuestionMutation,
    { loading: updateQuestionLoading }
  ] = useUpdateQuestionMutation();

  const handleThumbUpClick = (questionId: string) => {
    voteQuestionMutation({ variables: { questionId } });
  };

  return (
    <ListItem
      className={`${classes.listItem} ${
        question.top ? classes.topQuestion : ""
      }`}
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
              <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
            )}
          </Typography>
        }
        secondary={
          <React.Fragment>
            <FormattedDate value={question.updatedAt} />
            {", "}
            <FormattedTime value={question.updatedAt} />
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
                input: {
                  questionId: question.id,
                  content: values.content
                }
              }
            });
            handleEditContentToggle(question.id);
          }}
        >
          {formProps => (
            <Form className={classes.editContentForm}>
              <TextField
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
            {question.author?.id === userQueryResult.data?.meAudience.id &&
              !question.top && (
                <IconButton
                  className={classes.moreButton}
                  size="small"
                  onClick={e => handleMoreClick(e, question.id)}
                >
                  <MoreHorizIcon fontSize="inherit" />
                </IconButton>
              )}
          </Typography>
          <Box className={classes.questionActionBox}>
            {question.top && (
              <Tooltip
                title={formatMessage({ id: "Top", defaultMessage: "Top" })}
              >
                <TopIcon fontSize="small" color="disabled" />
              </Tooltip>
            )}
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
        </React.Fragment>
      )}
    </ListItem>
  );
};

export default QuestionItem;
