import React from "react";
import { Box, Card, CardActions, CardContent } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  useSignupMutation,
  useCheckNameOrEmailExistLazyQuery
} from "../../generated/graphqlHooks";
import { FTextField, ButtonLoading } from "../../components/Form";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";

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
          const { data } = await signupMutation({ variables: values });

          if (data) {
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
                margin="normal"
                disabled={loading}
              />
              <FTextField
                id="email"
                name="email"
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                disabled={loading}
              />
              <FTextField
                id="password"
                name="password"
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                disabled={loading}
              />
              <FTextField
                id="repeatPassword"
                name="repeatPassword"
                fullWidth
                label="Password repeat"
                type="password"
                margin="normal"
                disabled={loading}
              />
            </CardContent>
            <CardActions>
              <ButtonLoading
                type="submit"
                variant="contained"
                color="primary"
                loading={loading || checkNameLoading || checkEmailLoading}
                disabled={loading || checkNameLoading || checkEmailLoading}
              >
                <FormattedMessage
                  id="CREATE_ACCOUNT"
                  defaultMessage="创建账号"
                />
              </ButtonLoading>
            </CardActions>
          </Card>
        </Form>
      </Formik>
    </Box>
  );
};

export default Signup;
