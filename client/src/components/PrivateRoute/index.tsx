import React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router";
import { AUTH_TOKEN } from "../../constant";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function PrivateRoute({ children, ...rest }: RouteProps) {
  const token = localStorage.getItem(AUTH_TOKEN);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
