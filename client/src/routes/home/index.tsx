import React from "react";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import {
  usePgpQuery,
  useCheckEventCodeExistQuery
} from "../../generated/dataBinders";

const Home: React.FC = props => {
  const { data, loading, error } = usePgpQuery();
  const { data: checkData,error:checkError } = useCheckEventCodeExistQuery({
    variables: { code: "asdf" }
  });
  console.log(data, checkData,checkError);

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
