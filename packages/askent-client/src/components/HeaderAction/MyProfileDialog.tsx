import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Avatar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { ButtonLoading } from "../Form";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { QueryResult } from "@apollo/client";
import { MeQuery, MeQueryVariables } from "../../generated/graphqlHooks";
import { FormattedMessage, useIntl } from "react-intl";
import PersonIcon from "@material-ui/icons/Person";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { USER_NAME_MAX_LENGTH, USER_EMAIL_MAX_LENGTH } from "askent-common/src/constant";
import { useUpdateUserMutation } from "../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    largeAvatar: {
      width: theme.spacing(8),
      height: theme.spacing(8)
    },
    formItemBox: {
      margin: theme.spacing(0, 4)
    }
  })
);

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  open: boolean;
  onClose: () => void;
}

const MyProfileDialog: React.FC<Props> = ({
  userQueryResult,
  open,
  onClose
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { data: userData } = userQueryResult;
  const [
    updateAudienceUserMutation,
    { loading: updateProfileLoading }
  ] = useUpdateUserMutation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="My_profile" defaultMessage="My profile" />
      </DialogTitle>
      <Formik
        initialValues={{
          name: userData?.me.name || "",
          email: userData?.me.email || ""
        }}
        validationSchema={Yup.object({
          name: Yup.string().max(USER_NAME_MAX_LENGTH),
          email: Yup.string()
            .max(USER_EMAIL_MAX_LENGTH)
            .email()
        })}
        onSubmit={async (values, formikBag) => {
          await updateAudienceUserMutation({ variables: { input: values } });
          onClose();
        }}
      >
        {formProps => (
          <Form>
            <DialogContent>
              <Box display="flex" justifyContent="center">
                <Avatar
                  className={classes.largeAvatar}
                  alt={formProps.values.name}
                  src="/example.jpg"
                />
              </Box>
              <Box className={classes.formItemBox}>
                <Field
                  component={TextField}
                  fullWidth
                  autoFocus
                  name="name"
                  label={formatMessage({
                    id: "Your_name",
                    defaultMessage: "Your name"
                  })}
                  margin="normal"
                  disabled={updateProfileLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <Field
                  component={TextField}
                  fullWidth
                  name="email"
                  label={formatMessage({
                    id: "Email",
                    defaultMessage: "Email"
                  })}
                  margin="normal"
                  type="email"
                  disabled={updateProfileLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <DialogContentText>
                You are about to delete your personal information. All your
                questions or poll votes will be anonymized and this action
                cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage id="Cancel" defaultMessage="Cancel" />
              </Button>
              <ButtonLoading
                variant="contained"
                color="primary"
                type="submit"
                loading={updateProfileLoading}
              >
                <FormattedMessage id="Save" defaultMessage="Save" />
              </ButtonLoading>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default MyProfileDialog;
