import { AUTH_TOKEN, USER } from "./constant";

export function logout() {
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(USER);
}
