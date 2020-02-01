import { useState } from "react";
import { AUTH_TOKEN, AUDIENCE_AUTH_TOKEN } from "../constant";

type TokenKey = "authToken" | "audienceAuthToken";
type Token = { authToken?: string; audienceAuthToken?: string };

export function useToken() {
  const [token, setTokenState] = useState<Token>({
    authToken: localStorage.getItem(AUTH_TOKEN) || "",
    audienceAuthToken: localStorage.getItem(AUDIENCE_AUTH_TOKEN) || ""
  });

  function setToken(newToken: Token) {
    if (newToken.authToken) {
      localStorage.setItem(AUTH_TOKEN, newToken.authToken);
    }
    if (newToken.audienceAuthToken) {
      localStorage.setItem(AUDIENCE_AUTH_TOKEN, newToken.audienceAuthToken);
    }
    setTokenState(Object.assign({}, token, newToken));
  }
  function removeToken(key: TokenKey) {
    if (key === "audienceAuthToken") {
      localStorage.removeItem(AUDIENCE_AUTH_TOKEN);
      setTokenState(Object.assign({}, token, { audienceAuthToken: "" }));
    } else if (key === "authToken") {
      localStorage.removeItem(AUTH_TOKEN);
      setTokenState(Object.assign({}, token, { authToken: "" }));
    }
    //TODO: Reset store on logout, https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
  }
  function clearToken() {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(AUDIENCE_AUTH_TOKEN);
    setTokenState({ authToken: "", audienceAuthToken: "" });
  }

  return { token, setToken, removeToken, clearToken };
}
