import * as actionTypes from './actionTypes';

export const setTodos = (todos) => {
    return {
        type : actionTypes.SET_TODOS,
        todos
    }
}