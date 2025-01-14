import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCouponAction } from '../../State/Coupon/CouponActions';

const CouponComponent = () => {
    const dispatch = useDispatch();
    const coupon = useSelector(state => state.couponReducer.value);

    const generateCoupon = () => {
        const randomCoupon = Math.floor(100000 + Math.random() * 900000).toString();
        dispatch(generateCouponAction(randomCoupon));
    };

    return (
        <div>
            <h1>Coupon Generator</h1>
            <button onClick={generateCoupon}>Generate Coupon</button>
            {coupon && <p>Generated Coupon: {coupon}</p>}
        </div>
    );
};

export default CouponComponent;