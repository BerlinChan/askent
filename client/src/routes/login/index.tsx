import React from "react";
import { useHistory } from "react-router-dom";
import { Box, Card, CardActions, CardContent } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FTextField, ButtonLoading } from "../../components/Form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useLoginMutation } from "../../generated/graphqlHooks";
import { AUTH_TOKEN } from "../../constant";

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
    }
  })
);

const Login: React.FC = () => {
  const classes = useStyles();
  const [loginMutation, { loading }] = useLoginMutation();
  const history = useHistory();

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
              <ButtonLoading
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
                disabled={loading}
              >
                Log In
              </ButtonLoading>
            </CardActions>
          </Card>
        </Form>
      </Formik>
    </Box>
  );
};

export default Login;
