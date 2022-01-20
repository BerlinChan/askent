import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useToken } from "../../hooks";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useToken();
  let location = useLocation();

  return token ? (
    children
  ) : (
    <Redirect
      to={{
        pathname: "/unauthorized",
        state: { from: location },
      }}
    />
  );
}

export default RequireAuth;
