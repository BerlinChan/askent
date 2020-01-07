import React from "react";
import {
  TextField,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useSignupMutation } from "../../generated/graphqlHooks";

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

const Signup: React.FC = props => {
  const classes = useStyles();
  const [signupMutation, { data, loading, error }] = useSignupMutation();

  return (
    <Box className={classes.signupBox}>
      <form className={classes.form} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardContent>
            <TextField required fullWidth label="User Name" margin="normal" />
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              margin="normal"
            />
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              margin="normal"
            />
            <TextField
              required
              fullWidth
              label="Password repeat"
              type="password"
              margin="normal"
            />
          </CardContent>
          <CardActions>
            <div className={classes.buttonWrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={() => {
                  signupMutation({
                    variables: {
                      name: "Baobao",
                      email: "bao@bao",
                      password: "bao"
                    }
                  });
                }}
              >
                Create Account
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
      </form>
    </Box>
  );
};

export default Signup;
