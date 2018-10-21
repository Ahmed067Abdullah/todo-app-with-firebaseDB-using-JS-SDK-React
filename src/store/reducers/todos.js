import * as actionTypes from '../actions/actionTypes';

const initialState = {
    todos : []
}

const reducer = (state = initialState ,action) => {
    switch(action.type){
        case actionTypes.SET_TODOS:
            return {
                todos : action.todos,
            }
        default: 
            return {
                ...state
            }
    }
}

export default reducer;