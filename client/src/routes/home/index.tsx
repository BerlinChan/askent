import React from "react";
import { TextField, InputAdornment, Button } from "@material-ui/core";

const Home: React.FC = props => {
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
