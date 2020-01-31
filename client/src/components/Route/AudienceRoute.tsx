import React from "react";
import { Route, Redirect, useParams } from "react-router-dom";
import { RouteProps } from "react-router";
import { useToken } from "../../hooks";

export const AudienceRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { token } = useToken();
  const { id } = useParams();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        token.audienceAuthToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: `/event/${id}/login`,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};
