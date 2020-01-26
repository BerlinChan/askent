import React from "react";
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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  useIntl,
  FormattedMessage,
  FormattedDate,
  FormattedTime
} from "react-intl";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { QueryResult } from "@apollo/react-common";
import {
  Question,
  EventByMeQuery,
  EventByMeQueryVariables,
  useUpdateQuestionMutation
} from "../../../../generated/graphqlHooks";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import StarIcon from "@material-ui/icons/Star";
import TopIcon from "@material-ui/icons/Publish";
import QuestionToggleButton, {
  handleToggleInterface
} from "./QuestionToggleButton";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FTextField, ButtonLoading } from "../../../../components/Form";
import { QUESTION_CONTENT_MAX_LENGTH } from "../../../../constant";

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
    starQuestion: {
      backgroundColor: theme.palette.warning.light
    },
    topQuestion: {
      backgroundColor: theme.palette.success.light
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
  eventByMeQuery: QueryResult<EventByMeQuery, EventByMeQueryVariables>;
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
  eventByMeQuery,
  editContent,
  handleEditContentToggle,
  editContentInputRef
}) => {
  const classes = useStyles();
  const { data: eventByMeData } = eventByMeQuery;
  const { formatMessage } = useIntl();
  const [
    updateQuestionMutation,
    { loading: updateQuestionLoading }
  ] = useUpdateQuestionMutation();

  const handleArchiveClick: handleToggleInterface = async (e, id, archived) => {
    await updateQuestionMutation({
      variables: { input: { questionId: id, archived: !archived } }
    });
  };
  const handlePublishClick: handleToggleInterface = async (
    e,
    id,
    published
  ) => {
    await updateQuestionMutation({
      variables: { input: { questionId: id, published: !published } }
    });
  };
  const handleStarClick: handleToggleInterface = async (e, id, star) => {
    await updateQuestionMutation({
      variables: { input: { questionId: id, star: !star } }
    });
  };
  const handleTopClick: handleToggleInterface = async (e, id, top) => {
    await updateQuestionMutation({
      variables: { input: { questionId: id, top: !top } }
    });
  };

  return (
    <ListItem
      className={`${classes.listItem} ${
        question.star ? classes.starQuestion : ""
      } ${question.top ? classes.topQuestion : ""}`}
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
              <FTextField
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
            {question.published && (
              <QuestionToggleButton
                className="questionHover"
                id={question.id}
                status={question.star}
                onTitle={formatMessage({
                  id: "Unstar",
                  defaultMessage: "Unstar"
                })}
                offTitle={formatMessage({ id: "Star", defaultMessage: "Star" })}
                onIcon={<StarIcon fontSize="inherit" color="secondary" />}
                offIcon={<StarIcon fontSize="inherit" color="inherit" />}
                handleToggle={handleStarClick}
              />
            )}
            {question.published && !question.archived && (
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
            {eventByMeData?.eventByMe.moderation && !question.archived && (
              <QuestionToggleButton
                className="questionHover"
                id={question.id}
                status={question.published}
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
            {question.published && (
              <QuestionToggleButton
                className="questionHover"
                id={question.id}
                status={question.archived}
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
    </ListItem>
  );
};

export default QuestionListItem;