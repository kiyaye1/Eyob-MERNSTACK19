import * as actionTypes from "../ActionTypes";

let initialState = {
    user: {
        userName: "",
        password: "",
        street: "",
        mobile: 0
    },

    token: null,

    error: null,
};

let userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_USER_TO_STORE:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };

        case actionTypes.FETCH_USER_SUCCESS:
                return {
                    ...state,
                    user: action.payload, 
                    error: null,
                };

        case actionTypes.FETCH_USER_FAILURE:
                return {
                    ...state,
                    error: action.payload,
                };

        default:
            return state;
    }
};

export default userReducer;
