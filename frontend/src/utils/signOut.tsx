import { clearEmailCookie, clearRefreshTokenCookie, clearRoleCookie, clearTokenCookie } from "./cookies";

export const signOut = () => {
  clearRoleCookie();
  clearTokenCookie();
  clearRefreshTokenCookie();
  clearEmailCookie();
};
