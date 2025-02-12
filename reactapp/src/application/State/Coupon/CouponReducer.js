import * as actionTypes from "../ActionTypes";

const initialState = {
    value: '', 
};

const couponReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GENERATE_COUPON:
            return {
                ...state,
                value: action.payload, 
            };
        default:
            return state; 
    }
};

export default couponReducer;