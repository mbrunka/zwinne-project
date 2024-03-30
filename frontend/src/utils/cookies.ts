import Cookies from 'js-cookie';

export const clearTokenCookie = () => {
    Cookies.set('role', '')
}

export const clearRoleCookie = () => {
    Cookies.set('token', '')
}

export const setTokenCookie = (token: string) => {
    Cookies.set('token', token, { expires: 1 })
}

export const setRoleCookie = (token: string) => {
    Cookies.set('role', token)
}

export const getCurrentRole = () => {
    return Cookies.get('role');
}