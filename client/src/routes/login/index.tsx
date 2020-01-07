import React from "react";
import { useHistory, useLocation } from "react-router-dom";
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
import { useLoginMutation } from "../../generated/graphqlHooks";

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
  const [loginMutation, { data, loading, error }] = useLoginMutation();
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const login = () => {
    history.replace(from);
  };

  return (
    <Box className={classes.signupBox}>
      <form className={classes.form} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardContent>
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
          </CardContent>
          <CardActions>
            <div className={classes.buttonWrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={login}
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
      </form>
    </Box>
  );
};

export default Login;
