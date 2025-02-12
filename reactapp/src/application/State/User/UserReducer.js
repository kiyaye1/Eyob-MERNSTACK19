import * as actionTypes from "../ActionTypes";

let initialState = {
    user: {
        name: "",
        email: "",
        password: "",
        street: "",
        mobile: 0,
        hobbies: [],
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

        case actionTypes.SIGN_OUT_USER:
            return initialState

        case actionTypes.FETCH_USER_HOBBIES_SUCCESS:
            return {
                ...state,
                user: {
                ...state.user,
                hobbies: action.payload,
                },
            };
        
        case actionTypes.FETCH_USER_HOBBIES_FAILURE:

        case actionTypes.ADD_HOBBY_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
    
        case actionTypes.ADD_HOBBY_SUCCESS:
            return {
                ...state,
                user: {
                ...state.user,
                hobbies: [...state.user.hobbies, action.payload],
                },
            };

        default:
            return state;
    }
};

export default userReducer;