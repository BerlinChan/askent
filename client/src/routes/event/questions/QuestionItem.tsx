import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar
} from "@material-ui/core";
import { FormattedMessage, FormattedTime, FormattedDate } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  useVoteQuestionMutation,
  LiveQuestionFieldsFragment,
  useUpdateQuestionMutation
} from "../../../generated/graphqlHooks";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../components/Form";
import { QUESTION_CONTENT_MAX_LENGTH } from "../../../constant";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      flexWrap: "wrap",
      position: "relative"
    },
    questionContent: { width: "100%" },
    moreButton: { float: "right" },
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
    },
    editContentForm: { width: "100%" },
    editContentAction: { display: "flex", justifyContent: "space-between" },
    editContentFormButtons: { "& > *": { display: "inline-block" } }
  })
);

interface Props {
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
  question,
  handleMoreClick,
  editContent,
  handleEditContentToggle,
  editContentInputRef
}) => {
  const classes = useStyles();
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
    <ListItem className={classes.listItem} alignItems="flex-start" divider>
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
          <Typography variant="body2" color="textSecondary">
            <FormattedDate value={question.updatedAt} />
            {", "}
            <FormattedTime value={question.updatedAt} />
          </Typography>
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
            <IconButton
              className={classes.moreButton}
              size="small"
              onClick={e => handleMoreClick(e, question.id)}
            >
              <MoreHorizIcon fontSize="inherit" />
            </IconButton>
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
        </React.Fragment>
      )}
    </ListItem>
  );
};

export default QuestionItem;
