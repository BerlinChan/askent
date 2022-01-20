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
  Avatar,
  Hidden,
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
  USER_NAME_MAX_LENGTH,
} from "askent-common/src/constant";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { useSnackbar } from "notistack";
import {
  useCreateQuestionMutation,
  useUpdateUserMutation,
  useMeQuery,
} from "../../../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentFormControl: {
      width: "100%",
      display: "flex",
      flexWrap: "nowrap",
      flexDirection: "row",
    },
    adornmentBox: {
      textAlign: "center",
      marginTop: theme.spacing(0.5),
      opacity: 1,
      width: 32,
      overflow: "hidden",
      transition: theme.transitions.create(["width", "opacity"]),
      "&.collapse": { width: 0, opacity: 0 },
    },
    questionInput: {
      flex: 1,
      width: "100%",
      fontSize: theme.typography.pxToRem(18),
    },
    helperTextBox: {
      display: "flex",
      justifyContent: "space-between",
    },
    cardActions: {
      justifyContent: "space-between",
    },
    cardActionsMobile: { flexDirection: "column", alignItems: "flex-start" },
    nameBox: { display: "flex", alignItems: "center" },
    nameInput: { width: 150, marginRight: theme.spacing(1) },
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginRight: theme.spacing(1),
      fontSize: theme.typography.pxToRem(16),
    },
    anonymousSwitchLabel: {
      marginLeft: "unset",
      marginRight: "unset",
    },
    mobileSubmit: { width: "100%", marginTop: theme.spacing(1) },
  })
);

type QuestionValues = { content: string; name: string; anonymous: boolean };
interface Props {
  autoFocus?: boolean;
  onAfterSubmit?: () => void;
  onFocus?: () => void;
  className?: string;
}

const QuestionForm: React.FC<Props> = ({
  autoFocus = false,
  onAfterSubmit,
  onFocus,
  className,
}) => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const { data: userMeData } = useMeQuery();
  const [createQuestionMutation, { loading }] = useCreateQuestionMutation();
  const [
    updateAudienceUserMutation,
    { loading: updateUserLoading },
  ] = useUpdateUserMutation();

  const initialValues: QuestionValues = {
    content: "",
    name: userMeData?.me.name || "",
    anonymous: Boolean(userMeData?.me.anonymous),
  };
  const handleSubmit: (
    values: QuestionValues,
    formikHelpers: FormikHelpers<QuestionValues>
  ) => void | Promise<any> = async (values, formikBag) => {
    if (
      values.name !== userMeData?.me.name ||
      values.anonymous !== userMeData?.me.anonymous
    ) {
      if (values.name !== userMeData?.me.name && !values.anonymous) {
        // TODO: confirm.
        console.log(
          "Change your name? You are about to change your name. All your previous questions or poll votes will use your new name. However, you will not be able to change it again for the next 1 hour."
        );
      }
      await updateAudienceUserMutation({
        variables: {
          input:
            values.anonymous !== userMeData?.me.anonymous && values.anonymous
              ? { anonymous: true }
              : { name: values.name, anonymous: values.anonymous },
        },
      });
    }
    await createQuestionMutation({
      variables: {
        input: {
          eventId: id as string,
          content: values.content,
          anonymous: Boolean(values.anonymous && values.name),
        },
      },
    });
    !autoFocus && setExpanded(false);
    formikBag.resetForm();
    onAfterSubmit && onAfterSubmit();
  };

  const handleInputFocus = (formProps: FormikProps<QuestionValues>) => {
    if (!expanded) {
      formProps.setValues({
        ...formProps.values,
        name: userMeData?.me.name || "",
        anonymous: Boolean(userMeData?.me.anonymous),
      });
      setExpanded(true);
    }
    onFocus && onFocus();
  };
  const handleClickAway = () => {
    !autoFocus && setExpanded(false);
  };
  const handleSwitchClick = (currentAnonymous: boolean) => {
    enqueueSnackbar(
      currentAnonymous
        ? formatMessage({
            id: "As",
            defaultMessage: "As",
          }) + " user"
        : formatMessage({
            id: "As anonymous",
            defaultMessage: "As anonymous",
          }),
      {
        variant: "success",
      }
    );
  };

  const renderAvatarName = (formProps: FormikProps<QuestionValues>) => {
    return formProps.values.anonymous ? (
      <React.Fragment>
        <Avatar
          className={classes.avatar}
          alt={formatMessage({
            id: "Anonymous",
            defaultMessage: "Anonymous",
          })}
        />
        <Typography
          variant="body1"
          color="textSecondary"
          className={classes.nameInput}
        >
          <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
        </Typography>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Avatar
          className={classes.avatar}
          alt={formProps.values.name}
          src={userMeData?.me.avatar || ""}
        />
        <Field
          component={InputBase}
          className={classes.nameInput}
          name="name"
          placeholder={formatMessage({
            id: "Your_name(optional)",
            defaultMessage: "Your name(optional)",
          })}
          disabled={loading || updateUserLoading}
          onFocus={() => setExpanded(true)}
        />
      </React.Fragment>
    );
  };
  const renderAnonymousSwitch = (formProps: FormikProps<QuestionValues>) => {
    return (
      formProps.values.name && (
        <FormControlLabel
          className={classes.anonymousSwitchLabel}
          labelPlacement="end"
          control={
            <Field
              component={Switch}
              name="anonymous"
              type="checkbox"
              size="small"
              onClick={() => handleSwitchClick(formProps.values.anonymous)}
            />
          }
          label={
            <Typography
              variant="body2"
              color={
                formProps.values.anonymous ? "textPrimary" : "textSecondary"
              }
            >
              <FormattedMessage
                id="As anonymous"
                defaultMessage="As anonymous"
              />
            </Typography>
          }
        />
      )
    );
  };
  const renderSubmitButton = (fullWidth: boolean = false) => {
    return (
      <ButtonLoading
        fullWidth={fullWidth}
        size={fullWidth ? "large" : "medium"}
        variant="contained"
        color="primary"
        type="submit"
        loading={loading || updateUserLoading}
      >
        <FormattedMessage id="Send" defaultMessage="Send" />
      </ButtonLoading>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object({
        content: Yup.string().max(QUESTION_CONTENT_MAX_LENGTH).required(),
        name: Yup.string().max(USER_NAME_MAX_LENGTH),
      })}
      onSubmit={handleSubmit}
    >
      {(formProps) => (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Card className={className}>
            <Form>
              <CardContent>
                <FormControl className={classes.contentFormControl}>
                  <Box
                    className={
                      classes.adornmentBox + (expanded ? " collapse" : "")
                    }
                  >
                    <QuestionAnswerIcon color="secondary" />
                  </Box>
                  <Field
                    component={InputBase}
                    autoFocus={autoFocus}
                    multiline
                    minRows={3}
                    maxRows={8}
                    name="content"
                    className={classes.questionInput}
                    placeholder={formatMessage({
                      id: "Type_your_question",
                      defaultMessage: "Type your question",
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
                <Hidden smDown>
                  <CardActions className={classes.cardActions}>
                    <Box className={classes.nameBox}>
                      {renderAvatarName(formProps)}
                      {renderAnonymousSwitch(formProps)}
                    </Box>
                    {renderSubmitButton()}
                  </CardActions>
                </Hidden>
                <Hidden mdUp>
                  <CardActions
                    disableSpacing
                    className={classes.cardActionsMobile}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex">{renderAvatarName(formProps)}</Box>
                      {renderAnonymousSwitch(formProps)}
                    </Box>
                    <Box className={classes.mobileSubmit}>
                      {renderSubmitButton(true)}
                    </Box>
                  </CardActions>
                </Hidden>
              </Collapse>
            </Form>
          </Card>
        </ClickAwayListener>
      )}
    </Formik>
  );
};

export default QuestionForm;
