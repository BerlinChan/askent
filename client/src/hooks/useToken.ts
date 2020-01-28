import { useState } from "react";
import { AUTH_TOKEN, AUDIENCE_AUTH_TOKEN } from "../constant";

type Token = { authToken?: string; eventAuthToken?: string };

export default function useToken() {
  const [token, setTokenState] = useState<Token>({
    authToken: localStorage.getItem(AUTH_TOKEN) || "",
    eventAuthToken: localStorage.getItem(AUDIENCE_AUTH_TOKEN) || ""
  });

  function setToken(newToken: Token) {
    if (newToken.authToken) {
      localStorage.setItem(AUTH_TOKEN, newToken.authToken);
    }
    if (newToken.eventAuthToken) {
      localStorage.setItem(AUDIENCE_AUTH_TOKEN, newToken.eventAuthToken);
    }
    setTokenState(Object.assign({}, token, newToken));
  }
  function removeToken() {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(AUDIENCE_AUTH_TOKEN);
    setTokenState({ authToken: "", eventAuthToken: "" });
  }

  return { token, setToken, removeToken };
}
