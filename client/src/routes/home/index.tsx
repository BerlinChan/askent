import React from "react";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import { withPgp, PgpProps, PgpQueryResult } from "../../generated/dataBinders";

const withPgpData = withPgp<PgpProps>();

const Home = withPgpData((props) => {
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
});

export default Home;
