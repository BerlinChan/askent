import React from "react";
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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  useSignupMutation,
  useCheckNameOrEmailExistLazyQuery
} from "../../generated/graphqlHooks";
import { FTextField } from "../../components/Form";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

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

const Signup: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [signupMutation, { loading }] = useSignupMutation();
  const [
    checkNameExistLazyQuery,
    { data: checkNameData, loading: checkNameLoading }
  ] = useCheckNameOrEmailExistLazyQuery();
  const [
    checkEmailExistLazyQuery,
    { data: checkEmailData, loading: checkEmailLoading }
  ] = useCheckNameOrEmailExistLazyQuery();

  return (
    <Box className={classes.signupBox}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          repeatPassword: ""
        }}
        validate={async ({ name, email, password, repeatPassword }) => {
          try {
            await Yup.object({
              name: Yup.string()
                .max(30, "Must be 30 characters or less")
                .required("Required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
              password: Yup.string()
                .max(20, "Must be 20 characters or less")
                .required("Required"),
              repeatPassword: Yup.string()
                .max(20, "Must be 20 characters or less")
                .required("Required")
            }).validate({
              name,
              email,
              password,
              repeatPassword
            });
          } catch (err) {
            const { path, message } = err as Yup.ValidationError;
            const error: any = {};
            error[path] = message;

            return error;
          }

          if (password !== repeatPassword) {
            return { repeatPassword: "Not same" };
          }

          await checkNameExistLazyQuery({
            variables: {
              string: name
            }
          });
          if (checkNameData?.checkNameOrEmailExist) {
            return { name: "Name exist" };
          }
          await checkEmailExistLazyQuery({
            variables: {
              string: email
            }
          });
          if (checkEmailData?.checkNameOrEmailExist) {
            return { email: "Eamil exist" };
          }
        }}
        onSubmit={async values => {
          const res = await signupMutation({
            variables: values
          });

          if (res) {
            enqueueSnackbar("Sign up success!", {
              variant: "success"
            });
            history.replace("/login");
          }
        }}
      >
        <Form className={classes.form}>
          <Card className={classes.card}>
            <CardContent>
              <FTextField
                autoFocus
                id="name"
                name="name"
                fullWidth
                label="User Name"
                disabled={loading}
              />
              <FTextField
                id="email"
                name="email"
                fullWidth
                label="Email"
                type="email"
                disabled={loading}
              />
              <FTextField
                id="password"
                name="password"
                fullWidth
                label="Password"
                type="password"
                disabled={loading}
              />
              <FTextField
                id="repeatPassword"
                name="repeatPassword"
                fullWidth
                label="Password repeat"
                type="password"
                disabled={loading}
              />
            </CardContent>
            <CardActions>
              <div className={classes.buttonWrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || checkNameLoading || checkEmailLoading}
                >
                  Create Account
                </Button>
                {(loading || checkNameLoading || checkEmailLoading) && (
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

export default Signup;
