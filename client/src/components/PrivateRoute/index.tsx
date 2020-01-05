import React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.

export function PrivateRoute({ children, ...rest }: RouteProps) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        false ? (
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
