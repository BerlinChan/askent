import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardActions,
  CardContent
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../components/Form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useLoginMutation } from "../../generated/graphqlHooks";
import { useToken } from "../../hooks";
import { TextField } from "formik-material-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { PASSWORD_MAX_LENGTH, EMAIL_MAX_LENGTH } from "../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginBox: {
      textAlign: "center",
      marginTop: theme.spacing(4)
    },
    form: {
      width: 475,
      marginLeft: "auto",
      marginRight: "auto"
    },
    card: {
      padding: theme.spacing(2)
    }
  })
);

const Login: React.FC = () => {
  const classes = useStyles();
  const [loginMutation, { loading }] = useLoginMutation();
  const history = useHistory();
  const { formatMessage } = useIntl();
  const { token, setToken } = useToken();

  React.useEffect(() => {
    if (token) {
      history.replace("/admin");
    }
  });

  return (
    <Box className={classes.loginBox}>
      <Typography variant="h4" gutterBottom>
        <FormattedMessage id="Login" defaultMessage="Login" />
      </Typography>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .max(EMAIL_MAX_LENGTH)
            .email()
            .required(),
          password: Yup.string()
            .max(PASSWORD_MAX_LENGTH)
            .required()
        })}
        onSubmit={async values => {
          const { data } = await loginMutation({ variables: values });
          setToken(data?.login.token || "");
          history.replace("/admin");
        }}
      >
        <Form className={classes.form}>
          <Card className={classes.card}>
            <CardContent>
              <Field
                component={TextField}
                autoFocus
                fullWidth
                id="email"
                name="email"
                label={formatMessage({
                  id: "Email",
                  defaultMessage: "Email"
                })}
                type="email"
                margin="normal"
              />
              <Field
                component={TextField}
                fullWidth
                id="password"
                name="password"
                label={formatMessage({
                  id: "Password",
                  defaultMessage: "Password"
                })}
                type="password"
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <ButtonLoading
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
    </Box>
  );
};

export default Login;
