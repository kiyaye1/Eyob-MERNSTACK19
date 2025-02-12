import * as actionTypes from "../ActionTypes";

export const generateCouponAction = (coupon) => ({
    type: actionTypes.GENERATE_COUPON,
    payload: coupon, 
});