import React from "react";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import { withPgp } from "../../generated/dataBinders";

const Home: React.FC = props => {
  console.log(props);

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

export default withPgp()(Home);
