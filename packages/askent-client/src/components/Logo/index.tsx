import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";

const Logo: React.FC = () => {
  return (
    <Link
      color="inherit"
      variant="h6"
      underline="none"
      component={RouterLink}
      to="/"
    >
      Askent
    </Link>
  );
};

export default Logo;
