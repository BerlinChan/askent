import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";

export const Logo: React.FC = () => {
  return (
    <Link color="inherit" component={RouterLink} to="/" variant="h6">
      Askent
    </Link>
  );
};
