import { AUTH_TOKEN } from "./constant";

export function logout() {
  localStorage.removeItem(AUTH_TOKEN);
}
