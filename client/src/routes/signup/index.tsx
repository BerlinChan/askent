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
  const [signupMutation, { data, loading }] = useSignupMutation();
  const [
    checkNameExistLazyQuery,
    { data: checkNameData, loading: checkNameLoading }
  ] = useCheckNameOrEmailExistLazyQuery();
  const [
    checkEmailExistLazyQuery,
    { data: checkEmailData, loading: checkEmailLoading }
  ] = useCheckNameOrEmailExistLazyQuery();
  const checkNameExist = async (value: string) => {
    await checkNameExistLazyQuery({
      variables: {
        string: value
      }
    });
    if (checkNameData?.checkNameOrEmailExist) {
      return "Name exist";
    }

    return;
  };
  const checkEmailExist = async (value: string) => {
    await checkEmailExistLazyQuery({
      variables: {
        string: value
      }
    });
    if (checkEmailData?.checkNameOrEmailExist) {
      return "Eamil exist";
    }

    return;
  };

  return (
    <Box className={classes.signupBox}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: ""
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required")
        })}
        onSubmit={async values => {
          await signupMutation({
            variables: values
          });
          console.log(data);
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
                disabled={loading || checkNameLoading || checkEmailLoading}
                validate={checkNameExist}
              />
              <FTextField
                id="email"
                name="email"
                fullWidth
                label="Email"
                type="email"
                disabled={loading || checkNameLoading || checkEmailLoading}
                validate={checkEmailExist}
              />
              <FTextField
                id="password"
                name="password"
                fullWidth
                label="Password"
                type="password"
                disabled={loading || checkNameLoading || checkEmailLoading}
              />
              <FTextField
                id="repeatPassword"
                name="repeatPassword"
                fullWidth
                label="Password repeat"
                type="password"
                disabled={loading || checkNameLoading || checkEmailLoading}
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
