import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  Container,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../components/Form";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { useLoginMutation } from "../../generated/graphqlHooks";
import { useToken } from "../../hooks";
import { FTextField } from "../../components/Form";
import { FormattedMessage, useIntl } from "react-intl";
import {
  USER_PASSWORD_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
} from "askent-common/src/constant";

const useStyles = makeStyles<Theme, {}, string>((theme: Theme) => ({
    loginBox: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    card: {
      padding: theme.spacing(2),
    },
  }));
const Login: React.FC = () => {
  const classes = useStyles();
  const [loginMutation, { loading }] = useLoginMutation();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { token, setToken } = useToken();

  React.useEffect(() => {
    if (token) {
      navigate("/admin", { replace: true });
    }
  });

  return (
    <Container className={classes.loginBox} maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        <FormattedMessage id="Login" defaultMessage="Login" />
      </Typography>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string().max(USER_EMAIL_MAX_LENGTH).email().required(),
          password: Yup.string().max(USER_PASSWORD_MAX_LENGTH).required(),
        })}
        onSubmit={async (values) => {
          const { data } = await loginMutation({ variables: values });
          setToken(data?.login.token || "");
          navigate("/admin", { replace: true });

          // fix Hasura subscription auth, https://github.com/apollographql/subscriptions-transport-ws/issues/171
          window.location.reload();
        }}
      >
        <Form>
          <Card className={classes.card}>
            <CardContent>
              <Field
                component={FTextField}
                autoFocus
                fullWidth
                id="email"
                name="email"
                label={formatMessage({
                  id: "Email",
                  defaultMessage: "Email",
                })}
                type="email"
                margin="normal"
              />
              <Field
                component={FTextField}
                fullWidth
                id="password"
                name="password"
                label={formatMessage({
                  id: "Password",
                  defaultMessage: "Password",
                })}
                type="password"
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <ButtonLoading
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
                disabled={loading}
              >
                <FormattedMessage id="Log_In" defaultMessage="Log In" />
              </ButtonLoading>
            </CardActions>
          </Card>
        </Form>
      </Formik>
    </Container>
  );
};

export default Login;
