import React from "react";
import { LOCAL_STORAGE_KEY } from "../constant";
import { useApolloClient } from "@apollo/client";

export function useToken() {
  const [token, setTokenState] = React.useState<string>(
    localStorage.getItem(LOCAL_STORAGE_KEY.AUTH_TOKEN) || ""
  );
  const client = useApolloClient();

  function setToken(token: string) {
    setTokenState(token);
    localStorage.setItem(LOCAL_STORAGE_KEY.AUTH_TOKEN, token);
  }

  function removeToken() {
    setTokenState("");
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);
    client.resetStore();
  }

  return { token, setToken, removeToken };
}
