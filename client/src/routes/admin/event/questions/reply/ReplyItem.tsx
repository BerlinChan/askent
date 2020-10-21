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
} from "react-intl";
import {
  ReplyFieldsFragment,
  useUpdateQuestionReviewStatusMutation,
  useUpdateQuestionContentMutation,
  ReviewStatus,
} from "../../../../../generated/graphqlHooks";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import QuestionToggleButton, {
  handleToggleType,
} from "../../../../../components/QuestionToggleButton";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../../../components/Form";
import { QUESTION_CONTENT_MAX_LENGTH } from "../../../../../constant";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      flexWrap: "wrap",
      position: "relative",
      "&:hover .questionHover": { display: "inline-flex" },
      "& .questionHover": { display: "none" },
    },
    archiveQuestion: {
      backgroundColor: fade(theme.palette.warning.light, 0.3),
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
  reply: ReplyFieldsFragment;
  handleMoreClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  editContent: boolean;
  handleEditContentToggle: (id: string) => void;
  editContentInputRef: React.RefObject<HTMLInputElement>;
  isScrolling?: boolean;
}

const ReplyListItem: React.FC<Props> = ({
  reply,
  handleMoreClick,
  editContent,
  handleEditContentToggle,
  editContentInputRef,
  isScrolling = false,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [
    updateQuestionReviewStatusMutation,
    { loading: updateQuestionReviewStatusLoading },
  ] = useUpdateQuestionReviewStatusMutation();
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

  return (
    <ListItem
      component="div"
      className={`${classes.listItem} ${
        reply.reviewStatus === ReviewStatus.Archive
          ? classes.archiveQuestion
          : ""
      }`}
      alignItems="flex-start"
      divider
    >
      <React.Fragment>
        <ListItemAvatar>
          <Avatar
            alt={reply.author?.name as string}
            src={isScrolling ? "" : reply.author?.avatar}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" variant="body2" color="textPrimary">
              {reply.author?.name ? (
                reply.author?.name
              ) : (
                <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
              )}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <AccessTimeIcon style={{ fontSize: 12 }} />
              <Typography
                className={classes.questionMeta}
                component="span"
                variant="body2"
                color="inherit"
              >
                <FormattedDate value={reply.createdAt} />
                {", "}
                <FormattedTime value={reply.createdAt} />
              </Typography>
            </React.Fragment>
          }
        />
        {editContent ? (
          <Formik
            initialValues={{ content: reply.content }}
            validationSchema={Yup.object({
              content: Yup.string().max(QUESTION_CONTENT_MAX_LENGTH).required(),
            })}
            onSubmit={async (values) => {
              await updateQuestionContentMutation({
                variables: {
                  questionId: reply.id,
                  content: values.content,
                },
              });
              handleEditContentToggle(reply.id);
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
                      onClick={() => handleEditContentToggle(reply.id)}
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
              {reply.content}
            </Typography>
            <Box className={classes.questionActionBox}>
              {(reply.reviewStatus === ReviewStatus.Publish ||
                reply.reviewStatus === ReviewStatus.Archive) && (
                <QuestionToggleButton
                  className="questionHover"
                  id={reply.id}
                  status={reply.reviewStatus === ReviewStatus.Archive}
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
                onClick={(e) => handleMoreClick(e, reply.id)}
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

export default React.memo(ReplyListItem, (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return R.equals(prevProps, nextProps);
});
