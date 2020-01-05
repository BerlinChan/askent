import React from "react";
import { TextField, Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: 200
      }
    }
  })
);

const Signup: React.FC = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField required label="Username" />
          <TextField
            required
            label="Email"
            type="email"
            helperText="Incorrect entry."
          />
        </div>
        <div>
          <TextField required label="Password" type="password" />
          <TextField
            required
            label="Password repeat"
            type="password"
            helperText="Incorrect entry."
          />
        </div>
      </form>
      <Button variant="contained" color="primary">
        Create Account
      </Button>
    </React.Fragment>
  );
};

export default Signup;
