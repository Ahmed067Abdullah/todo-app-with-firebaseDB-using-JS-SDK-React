import * as actionTypes from '../actions/actionTypes';

const initialState = {
    uid : null,
    isLoggedIn : false
}

const reducer = (state = initialState ,action) => {
    switch(action.type){
        case actionTypes.SET_LOGIN:
            return{
                uid : action.uid,
                isLoggedIn : true,
            }
        case actionTypes.SET_LOGOUT:
            return{
            uid : null,
            isLoggedIn : false,
        }
        default : 
            return {
                ...state
            }
    }
}

export default reducer;