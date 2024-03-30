import Cookies from 'js-cookie';

export const setTokenCookie = (token: string, refreshToken: string, email?: string) => {
    const tokenExpiry = new Date();
    tokenExpiry.setTime(tokenExpiry.getTime() + (5 * 60 * 1000)); // 5 minutes in milliseconds
    Cookies.set('token', token, { expires: tokenExpiry });

    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setTime(refreshTokenExpiry.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds
    Cookies.set('refreshToken', refreshToken, { expires: refreshTokenExpiry });

    if (email) Cookies.set('email', email);
}

export const clearTokenCookie = () => {
    Cookies.set('token', '')
}

export const clearRefreshTokenCookie = () => {
    Cookies.set('refreshToken', '')
}

export const clearEmailCookie = () => {
    Cookies.set('email', '')
}

export const setRoleCookie = (token: string) => {
    Cookies.set('role', token)
}

export const getCurrentRole = () => {
    return Cookies.get('role');
}

export const clearRoleCookie = () => {
    Cookies.set('token', '')
}