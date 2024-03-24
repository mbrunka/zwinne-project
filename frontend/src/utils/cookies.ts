import Cookies from 'js-cookie';

export const clearTokenCookie = () => {
    Cookies.set('token', '')
}

export const setTokenCookie = (token: string) =>{
    Cookies.set('token', token, { expires: 1 })
}