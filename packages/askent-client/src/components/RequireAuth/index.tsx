import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToken } from "../../hooks";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useToken();
  let location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} />
  );
}

export default RequireAuth;
