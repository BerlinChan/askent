import React from "react";
import { TOKEN_KEY } from "../constant";
import { useApolloClient } from "@apollo/client";

export function useToken(tokenKey: TOKEN_KEY) {
  const [token, setTokenState] = React.useState<string>(
    localStorage.getItem(tokenKey) || ""
  );
  const client = useApolloClient();

  function setToken(token: string) {
    setTokenState(token);
    localStorage.setItem(tokenKey, token);
  }

  function removeToken() {
    setTokenState("");
    localStorage.removeItem(tokenKey);
    client.resetStore();
  }

  return { token, setToken, removeToken };
}
