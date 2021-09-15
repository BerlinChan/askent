import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Avatar,
  IconButton,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { FormattedMessage, useIntl } from "react-intl";
import { InputBase, Switch } from "formik-material-ui";
import { Formik, Form, Field, FormikProps, FormikHelpers } from "formik";
import { FInputWithLabel } from "../../../../../components/Form";
import * as Yup from "yup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  REPLY_CONTENT_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
} from "askent-common/src/constant";
import { useSnackbar } from "notistack";
import {
  useCreateReplyMutation,
  useUpdateUserMutation,
  useMeQuery,
} from "../../../../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentFormControl: {
      width: "100%",
      display: "flex",
      flexWrap: "nowrap",
      flexDirection: "row",
    },
    replyInput: {
      flex: 1,
      width: "100%",
      fontSize: theme.typography.pxToRem(18),
    },
    helperTextBox: {
      display: "flex",
      justifyContent: "space-between",
    },
    nameBox: {
      display: "flex",
      alignItems: "center",
    },
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

type ReplyValues = { content: string; name: string; anonymous: boolean };
interface Props {
  className?: string;
  questionId: string;
  autoFocus?: boolean;
  onAfterSubmit?: () => void;
}

const ReplyForm: React.FC<Props> = ({
  className,
  questionId,
  autoFocus = false,
  onAfterSubmit,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { data: userMeData } = useMeQuery();
  const [createReplyMutation, { loading }] = useCreateReplyMutation();
  const [
    updateAudienceUserMutation,
    { loading: updateUserLoading },
  ] = useUpdateUserMutation();

  const initialValues: ReplyValues = {
    content: "",
    name: userMeData?.me.name || "",
    anonymous: Boolean(userMeData?.me.anonymous),
  };
  const handleSubmit: (
    values: ReplyValues,
    formikHelpers: FormikHelpers<ReplyValues>
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
    await createReplyMutation({
      variables: {
        input: {
          questionId,
          content: values.content,
          anonymous: Boolean(values.anonymous && values.name),
        },
      },
    });
    formikBag.resetForm();
    onAfterSubmit && onAfterSubmit();
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

  const renderAvatarName = (formProps: FormikProps<ReplyValues>) => {
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
          src={userMeData?.me.avatar||""}
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
        />
      </React.Fragment>
    );
  };
  const renderAnonymousSwitch = (formProps: FormikProps<ReplyValues>) => {
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
  const renderSubmitButton = (formProps: FormikProps<ReplyValues>) => {
    return (
      <IconButton
        color="primary"
        type="submit"
        title={formatMessage({ id: "Send", defaultMessage: "Send" })}
        disabled={
          !formProps.values.content.trim() || loading || updateUserLoading
        }
      >
        <SendIcon />
      </IconButton>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object({
        content: Yup.string().max(REPLY_CONTENT_MAX_LENGTH).required(),
        name: Yup.string().max(USER_NAME_MAX_LENGTH),
      })}
      onSubmit={handleSubmit}
    >
      {(formProps) => (
        <Form className={className}>
          <FormControl className={classes.contentFormControl}>
            <FInputWithLabel
              autoFocus={autoFocus}
              multiline
              minRows={1}
              maxRows={5}
              className={classes.replyInput}
              size="small"
              name="content"
              label={formatMessage({
                id: "Type_your_reply",
                defaultMessage: "Type your reply",
              })}
              disabled={loading || updateUserLoading}
            />
          </FormControl>
          <Box className={classes.helperTextBox}>
            <FormHelperText
              error={Boolean(
                (formProps.touched.content && formProps.errors.content) ||
                  (formProps.touched.name && formProps.errors.name)
              )}
            >
              {formProps.errors.content || formProps.errors.name}
            </FormHelperText>
            <Typography variant="body2" color="textSecondary">
              {REPLY_CONTENT_MAX_LENGTH -
                formProps.values.content.length +
                " / " +
                REPLY_CONTENT_MAX_LENGTH}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box className={classes.nameBox}>
              {renderAvatarName(formProps)}
              {renderAnonymousSwitch(formProps)}
            </Box>
            {renderSubmitButton(formProps)}
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ReplyForm;
