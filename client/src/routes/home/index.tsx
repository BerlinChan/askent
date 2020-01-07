import React from "react";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import {
  useCheckEventCodeExistQuery,
  usePackageInfoMutation
} from "../../generated/dataBinders";

const Home: React.FC = props => {
  const { data: checkData, loading, error } = useCheckEventCodeExistQuery({
    variables: { code: "code" }
  });
  const [packageInfoMutation, { data: infoData }] = usePackageInfoMutation();
  console.log(checkData, infoData);

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
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          packageInfoMutation({
            variables: { version: "0.2.0", description: "Some text" }
          })
        }
      >
        Join
      </Button>
    </React.Fragment>
  );
};

export default Home;
