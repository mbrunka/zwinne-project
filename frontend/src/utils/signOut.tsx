import { clearRoleCookie, clearTokenCookie } from "./cookies";

export const signOut = () => {
  clearRoleCookie();
  clearTokenCookie();
};
