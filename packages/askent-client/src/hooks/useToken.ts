import React from "react";
import { AUTH_TOKEN } from "../constant";
import { useApolloClient } from "@apollo/client";

export function useToken() {
  const [token, setTokenState] = React.useState<string>(
    localStorage.getItem(AUTH_TOKEN) || ""
  );
  const client = useApolloClient();

  function setToken(token: string) {
    setTokenState(token);
    localStorage.setItem(AUTH_TOKEN, token);
  }

  function removeToken() {
    setTokenState("");
    localStorage.removeItem(AUTH_TOKEN);
    client.resetStore();

    // fix Hasura subscription auth, https://github.com/apollographql/subscriptions-transport-ws/issues/171
    window.location.reload();
  }

  return { token, setToken, removeToken };
}
