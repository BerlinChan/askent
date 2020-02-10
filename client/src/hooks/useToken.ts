import React from "react";
import { AUTH_TOKEN } from "../constant";

export function useToken() {
  const [token, setTokenState] = React.useState<string>(
    localStorage.getItem(AUTH_TOKEN) || ""
  );

  function setToken(token: string) {
    setTokenState(token);
    localStorage.setItem(AUTH_TOKEN, token);
  }

  function removeToken() {
    setTokenState("");
    localStorage.removeItem(AUTH_TOKEN);
  }

  return { token, setToken, removeToken };
}
