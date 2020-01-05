import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  AppBar,
  TextField,
  InputAdornment,
  Button,
  Toolbar,
  Typography,
  IconButton
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

const Home: React.FC = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <form noValidate autoComplete="off">
        <TextField
          id="filled-basic"
          label="Event Code"
          variant="filled"
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>
          }}
        />
      </form>
      <Button variant="contained" color="primary">
        Join
      </Button>
    </React.Fragment>
  );
};

export default Home;
