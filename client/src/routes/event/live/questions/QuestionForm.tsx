import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  Collapse,
  FormHelperText,
  ClickAwayListener,
  Avatar
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { ButtonLoading } from "../../../../components/Form";
import { InputBase } from "formik-material-ui";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  QUESTION_CONTENT_MAX_LENGTH,
  USERNAME_MAX_LENGTH
} from "../../../../constant";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { QueryResult } from "@apollo/react-common";
import {
  MeAudienceQuery,
  MeAudienceQueryVariables,
  useCreateQuestionMutation,
  useUpdateAudienceUserMutation
} from "../../../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    QuestionFormControl: {
      width: "100%",
      display: "flex",
      flexWrap: "nowrap",
      flexDirection: "row"
    },
    adornmentBox: {
      textAlign: "center",
      marginTop: theme.spacing(0.5),
      opacity: 1,
      width: 32,
      overflow: "hidden",
      transition: theme.transitions.create(["width", "opacity"]),
      "&.collapse": { width: 0, opacity: 0 }
    },
    questionInput: {
      flex: 1,
      width: "100%",
      fontSize: theme.typography.pxToRem(18)
    },
    helperTextBox: {
      display: "flex",
      justifyContent: "space-between"
    },
    cardActions: {
      justifyContent: "space-between"
    },
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginRight: theme.spacing(1),
      fontSize: theme.typography.pxToRem(16)
    }
  })
);

interface Props {
  userQueryResult: QueryResult<MeAudienceQuery, MeAudienceQueryVariables>;
}

const QuestionForm: React.FC<Props> = ({ userQueryResult }) => {
  const classes = useStyles();
  let { id } = useParams();
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [createQuestionMutation, { loading }] = useCreateQuestionMutation();
  const [
    updateAudienceUserMutation,
    { loading: updateUserLoading }
  ] = useUpdateAudienceUserMutation();

  const handleClickAway = () => {
    setExpanded(false);
  };

  return (
    <Formik
      initialValues={{
        question: "",
        name: ""
      }}
      validationSchema={Yup.object({
        question: Yup.string()
          .max(QUESTION_CONTENT_MAX_LENGTH)
          .required(),
        name: Yup.string().max(USERNAME_MAX_LENGTH)
      })}
      onSubmit={async (values, formikBag) => {
        if (values.name !== userQueryResult.data?.meAudience.name) {
          await updateAudienceUserMutation({
            variables: { input: { name: values.name } }
          });
        }
        await createQuestionMutation({
          variables: { eventId: id as string, content: values.question }
        });
        setExpanded(false);
        formikBag.resetForm();
      }}
    >
      {formProps => (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Card>
            <Form>
              <CardContent>
                <FormControl className={classes.QuestionFormControl}>
                  <Box
                    className={
                      classes.adornmentBox + (expanded ? " collapse" : "")
                    }
                  >
                    <QuestionAnswerIcon />
                  </Box>
                  <InputBase
                    multiline
                    rows={3}
                    rowsMax={8}
                    name="question"
                    className={classes.questionInput}
                    placeholder={formatMessage({
                      id: "Type_your_question",
                      defaultMessage: "Type your question"
                    })}
                    disabled={loading || updateUserLoading}
                    onFocus={() => {
                      if (!expanded && !formProps.touched.name) {
                        formProps.setFieldValue(
                          "name",
                          userQueryResult.data?.meAudience.name || ""
                        );
                      }
                      setExpanded(true);
                    }}
                  />
                </FormControl>
                <Collapse in={expanded}>
                  <Box className={classes.helperTextBox}>
                    <FormHelperText
                      error={Boolean(
                        (formProps.touched.question &&
                          formProps.errors.question) ||
                          (formProps.touched.name && formProps.errors.name)
                      )}
                    >
                      {formProps.errors.question || formProps.errors.name}
                    </FormHelperText>
                    <Typography variant="body2" color="textSecondary">
                      {QUESTION_CONTENT_MAX_LENGTH -
                        formProps.values.question.length}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
              <Collapse in={expanded}>
                <CardActions className={classes.cardActions}>
                  <Box display="flex">
                    <Avatar
                      className={classes.avatar}
                      alt={formProps.values.name}
                      src="/example.jpg"
                    />
                    <InputBase
                      name="name"
                      placeholder={formatMessage({
                        id: "Your_name(optional)",
                        defaultMessage: "Your name(optional)"
                      })}
                      disabled={loading || updateUserLoading}
                      onFocus={() => setExpanded(true)}
                    />
                  </Box>
                  <ButtonLoading
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={loading || updateUserLoading}
                  >
                    <FormattedMessage id="Send" defaultMessage="Send" />
                  </ButtonLoading>
                </CardActions>
              </Collapse>
            </Form>
          </Card>
        </ClickAwayListener>
      )}
    </Formik>
  );
};

export default QuestionForm;
