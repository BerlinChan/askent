import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress
} from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FTextField } from "../../components/Form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useLoginMutation } from "../../generated/graphqlHooks";
import { AUTH_TOKEN, USER } from "../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    signupBox: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(4)
    },
    form: {
      width: 475
    },
    card: {
      padding: theme.spacing(2)
    },
    buttonWrapper: {
      margin: theme.spacing(1),
      position: "relative"
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  })
);

const Login: React.FC = () => {
  const classes = useStyles();
  const [loginMutation, { loading }] = useLoginMutation();
  const history = useHistory();
  if (localStorage.getItem(AUTH_TOKEN)) {
    history.replace("/admin");
  }

  return (
    <Box className={classes.signupBox}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email()
            .required(),
          password: Yup.string()
            .max(20)
            .required()
        })}
        onSubmit={async values => {
          const { data } = await loginMutation({ variables: values });
          localStorage.setItem(AUTH_TOKEN, data?.login.token as string);
          localStorage.setItem(USER, JSON.stringify(data?.login.user));
          history.replace("/admin");
        }}
      >
        <Form className={classes.form}>
          <Card className={classes.card}>
            <CardContent>
              <FTextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                margin="normal"
              />
              <FTextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <div className={classes.buttonWrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Log In
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </CardActions>
          </Card>
        </Form>
      </Formik>
    </Box>
  );
};

export default Login;
