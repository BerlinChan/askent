import React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router";
import { useToken } from "../../hooks";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { token } = useToken();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/unauthorized",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
