import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Typography } from "@material-ui/core";
import { useToken } from "../../hooks";
import { FormattedMessage } from "react-intl";

const Error401: React.FC = props => {
  const { removeToken } = useToken();

  React.useEffect(() => {
    removeToken();
  });

  return (
    <React.Fragment>
      <Typography variant="h4">401 Unauthorized</Typography>
      <Link color="inherit" component={RouterLink} to="/">
        <FormattedMessage id="Back_to_home" defaultMessage="Back to home" />
      </Link>
    </React.Fragment>
  );
};

export default Error401;
