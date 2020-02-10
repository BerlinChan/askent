import { useState } from "react";
import { AUTH_TOKEN } from "../constant";

type TokenKey = "authToken";
type Token = { authToken?: string };

export function useToken() {
  const [token, setTokenState] = useState<Token>({
    authToken: localStorage.getItem(AUTH_TOKEN) || ""
  });

  function setToken(newToken: Token) {
    if (newToken.authToken) {
      localStorage.setItem(AUTH_TOKEN, newToken.authToken);
    }
    setTokenState(Object.assign({}, token, newToken));
  }
  function removeToken(key: TokenKey) {
    if (key === "authToken") {
      localStorage.removeItem(AUTH_TOKEN);
      setTokenState(Object.assign({}, token, { authToken: "" }));
    }
    //TODO: Reset store on logout, https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
  }
  function clearToken() {
    localStorage.removeItem(AUTH_TOKEN);
    setTokenState({ authToken: "" });
  }

  return { token, setToken, removeToken, clearToken };
}
