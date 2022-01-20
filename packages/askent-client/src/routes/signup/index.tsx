import React from "react";
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  Container,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  useSignupMutation,
  useCheckEmailExistLazyQuery,
} from "../../generated/graphqlHooks";
import { ButtonLoading } from "../../components/Form";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField } from "formik-material-ui";
import {
  USER_NAME_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
} from "askent-common/src/constant";
import { useToken } from "../../hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    signupBox: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    card: {
      padding: theme.spacing(2),
    },
  })
);

const Signup: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [signupMutation, { loading }] = useSignupMutation();
  const [
    checkEmailExistLazyQuery,
    { data: checkEmailData, loading: checkEmailLoading },
  ] = useCheckEmailExistLazyQuery();
  const { token } = useToken();

  React.useEffect(() => {
    if (token) {
      navigate("/admin", { replace: true });
    }
  });

  return (
    <Container className={classes.signupBox} maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        <FormattedMessage id="Sign_up" defaultMessage="Sign up" />
      </Typography>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          repeatPassword: "",
        }}
        validate={async ({ name, email, password, repeatPassword }) => {
          try {
            await Yup.object({
              name: Yup.string()
                .max(
                  USER_NAME_MAX_LENGTH,
                  `Must be ${USER_NAME_MAX_LENGTH} characters or less`
                )
                .required("Required"),
              email: Yup.string()
                .max(
                  USER_EMAIL_MAX_LENGTH,
                  `Must be ${USER_EMAIL_MAX_LENGTH} characters or less`
                )
                .email("Invalid email address")
                .required("Required"),
              password: Yup.string()
                .max(
                  USER_PASSWORD_MAX_LENGTH,
                  `Must be ${USER_PASSWORD_MAX_LENGTH} characters or less`
                )
                .required("Required"),
              repeatPassword: Yup.string()
                .max(
                  USER_PASSWORD_MAX_LENGTH,
                  `Must be ${USER_PASSWORD_MAX_LENGTH} characters or less`
                )
                .required("Required"),
            }).validate({
              name,
              email,
              password,
              repeatPassword,
            });
          } catch (err) {
            const { path, errors } = err as Yup.ValidationError;
            console.error(path, errors);

            return { [path as string]: errors[0] };
          }

          if (password !== repeatPassword) {
            return { repeatPassword: "Not same" };
          }

          await checkEmailExistLazyQuery({
            variables: {
              email,
            },
          });
          if (checkEmailData?.checkEmailExist) {
            return { email: "Eamil exist" };
          }
        }}
        onSubmit={async (values) => {
          const { data } = await signupMutation({ variables: values });

          if (data) {
            enqueueSnackbar("Sign up success!", {
              variant: "success",
            });
            navigate("/login", { replace: true });
          }
        }}
      >
        <Form>
          <Card className={classes.card}>
            <CardContent>
              <Field
                component={TextField}
                autoFocus
                id="name"
                name="name"
                fullWidth
                label={formatMessage({
                  id: "User_name",
                  defaultMessage: "User name",
                })}
                margin="normal"
                disabled={loading}
              />
              <Field
                component={TextField}
                id="email"
                name="email"
                fullWidth
                label={formatMessage({ id: "Email", defaultMessage: "Email" })}
                type="email"
                margin="normal"
                disabled={loading}
              />
              <Field
                component={TextField}
                id="password"
                name="password"
                fullWidth
                label={formatMessage({
                  id: "Password",
                  defaultMessage: "Password",
                })}
                type="password"
                margin="normal"
                disabled={loading}
              />
              <Field
                component={TextField}
                id="repeatPassword"
                name="repeatPassword"
                fullWidth
                label={formatMessage({
                  id: "Password_repeat",
                  defaultMessage: "Password repeat",
                })}
                type="password"
                margin="normal"
                disabled={loading}
              />
            </CardContent>
            <CardActions>
              <ButtonLoading
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                loading={loading || checkEmailLoading}
                disabled={loading || checkEmailLoading}
              >
                <FormattedMessage
                  id="CREATE_ACCOUNT"
                  defaultMessage="Create account"
                />
              </ButtonLoading>
            </CardActions>
          </Card>
        </Form>
      </Formik>
    </Container>
  );
};

export default Signup;
