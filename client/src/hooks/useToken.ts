import { useState } from "react";
import { AUTH_TOKEN, AUDIENCE_AUTH_TOKEN } from "../constant";

type Token = { authToken?: string; audienceAuthToken?: string };

export default function useToken() {
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
  function removeToken() {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(AUDIENCE_AUTH_TOKEN);
    setTokenState({ authToken: "", audienceAuthToken: "" });
  }

  return { token, setToken, removeToken };
}
