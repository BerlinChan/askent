import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  FormControlLabel,
  Collapse,
  FormHelperText,
  ClickAwayListener,
  Avatar
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { ButtonLoading } from "../../../../components/Form";
import { InputBase, Switch } from "formik-material-ui";
import { Formik, Form, Field, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  QUESTION_CONTENT_MAX_LENGTH,
  USERNAME_MAX_LENGTH
} from "../../../../constant";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  useCreateQuestionMutation,
  useUpdateUserMutation
} from "../../../../generated/graphqlHooks";
import { useSnackbar } from "notistack";

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
    nameBox: { display: "flex", alignItems: "center" },
    nameInput: { width: 140, marginRight: theme.spacing(2) },
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginRight: theme.spacing(1),
      fontSize: theme.typography.pxToRem(16)
    }
  })
);

type QuestionValues = { content: string; name: string; anonymous: boolean };
interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
}

const QuestionForm: React.FC<Props> = ({ userQueryResult }) => {
  const classes = useStyles();
  let { id } = useParams();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [createQuestionMutation, { loading }] = useCreateQuestionMutation();
  const [
    updateAudienceUserMutation,
    { loading: updateUserLoading }
  ] = useUpdateUserMutation();

  const initialValues: QuestionValues = {
    content: "",
    name: "",
    anonymous: false
  };
  const handleSubmit: (
    values: QuestionValues,
    formikHelpers: FormikHelpers<QuestionValues>
  ) => void | Promise<any> = async (values, formikBag) => {
    if (
      values.name !== userQueryResult.data?.me.name ||
      values.anonymous !== userQueryResult.data?.me.anonymous
    ) {
      if (values.name !== userQueryResult.data?.me.name) {
        // TODO: confirm. Change your name? You are about to change your name. All your previous questions or poll votes will use your new name. However, you will not be able to change it again for the next 1 hour.
      }
      await updateAudienceUserMutation({
        variables: {
          input:
            values.anonymous !== userQueryResult.data?.me.anonymous &&
            userQueryResult.data?.me.anonymous === true
              ? { anonymous: true }
              : { name: values.name }
        }
      });
    }
    await createQuestionMutation({
      variables: {
        input: {
          eventId: id as string,
          content: values.content,
          anonymous: values.anonymous
        }
      }
    });
    setExpanded(false);
    formikBag.resetForm();
  };

  const handleInputFocus = (formProps: FormikProps<QuestionValues>) => {
    if (!expanded) {
      formProps.setValues({
        ...formProps.values,
        name: userQueryResult.data?.me.name || "",
        anonymous: Boolean(userQueryResult.data?.me.anonymous)
      });
      setExpanded(true);
    }
  };
  const handleClickAway = () => {
    setExpanded(false);
  };
  const handleSwitchClick = (currentAnonymous: boolean) => {
    enqueueSnackbar(
      currentAnonymous
        ? formatMessage({
            id: "As",
            defaultMessage: "As"
          }) + " user"
        : formatMessage({
            id: "As anonymous",
            defaultMessage: "As anonymous"
          }),
      {
        variant: "success"
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        content: Yup.string()
          .max(QUESTION_CONTENT_MAX_LENGTH)
          .required(),
        name: Yup.string().max(USERNAME_MAX_LENGTH)
      })}
      onSubmit={handleSubmit}
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
                  <Field
                    component={InputBase}
                    multiline
                    rows={3}
                    rowsMax={8}
                    name="content"
                    className={classes.questionInput}
                    placeholder={formatMessage({
                      id: "Type_your_question",
                      defaultMessage: "Type your question"
                    })}
                    disabled={loading || updateUserLoading}
                    onFocus={() => handleInputFocus(formProps)}
                  />
                </FormControl>
                <Collapse in={expanded}>
                  <Box className={classes.helperTextBox}>
                    <FormHelperText
                      error={Boolean(
                        (formProps.touched.content &&
                          formProps.errors.content) ||
                          (formProps.touched.name && formProps.errors.name)
                      )}
                    >
                      {formProps.errors.content || formProps.errors.name}
                    </FormHelperText>
                    <Typography variant="body2" color="textSecondary">
                      {QUESTION_CONTENT_MAX_LENGTH -
                        formProps.values.content.length}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
              <Collapse in={expanded}>
                <CardActions className={classes.cardActions}>
                  <Box className={classes.nameBox}>
                    {formProps.values.anonymous ? (
                      <React.Fragment>
                        <Avatar
                          className={classes.avatar}
                          alt={formatMessage({
                            id: "Anonymous",
                            defaultMessage: "Anonymous"
                          })}
                        />
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          className={classes.nameInput}
                        >
                          <FormattedMessage
                            id="Anonymous"
                            defaultMessage="Anonymous"
                          />
                        </Typography>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Avatar
                          className={classes.avatar}
                          alt={formProps.values.name}
                          src={userQueryResult.data?.me.avatar}
                        />
                        <Field
                          component={InputBase}
                          className={classes.nameInput}
                          name="name"
                          placeholder={formatMessage({
                            id: "Your_name(optional)",
                            defaultMessage: "Your name(optional)"
                          })}
                          disabled={loading || updateUserLoading}
                          onFocus={() => setExpanded(true)}
                        />
                      </React.Fragment>
                    )}
                    {formProps.values.name && (
                      <FormControlLabel
                        labelPlacement="end"
                        control={
                          <Field
                            component={Switch}
                            name="anonymous"
                            type="checkbox"
                            size="small"
                            onClick={() =>
                              handleSwitchClick(formProps.values.anonymous)
                            }
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            color={
                              formProps.values.anonymous
                                ? "textPrimary"
                                : "textSecondary"
                            }
                          >
                            <FormattedMessage
                              id="As anonymous"
                              defaultMessage="As anonymous"
                            />
                          </Typography>
                        }
                      />
                    )}
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
