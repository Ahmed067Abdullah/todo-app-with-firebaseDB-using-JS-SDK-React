import * as actionTypes from './actionTypes';

export const setLogin = (uid) => {
    return {
        type : actionTypes.SET_LOGIN,
        uid
    }
}

export const setLogout = () => {
    return {
        type : actionTypes.SET_LOGOUT
    }
}