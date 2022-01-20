import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link, Typography } from "@material-ui/core";
import { useToken } from "../../hooks";
import { FormattedMessage } from "react-intl";

const Error401: React.FC = (props) => {
  const { removeToken } = useToken();
  const [countdown, setCountdown] = React.useState(5);
  const navigate = useNavigate();

  React.useEffect(() => {
    removeToken();
    const intervalHandler = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        navigate("/", { replace: true });
      }
    }, 1000);

    return () => clearInterval(intervalHandler);
  });

  return (
    <React.Fragment>
      <Typography variant="h4">401 Unauthorized</Typography>
      <Typography>
        <FormattedMessage id="Will back to" defaultMessage="Will back to" />
      </Typography>
      <Link color="inherit" component={RouterLink} to="/">
        <FormattedMessage id="home_page" defaultMessage="home page " />
      </Link>
      in {countdown}s
    </React.Fragment>
  );
};

export default Error401;
