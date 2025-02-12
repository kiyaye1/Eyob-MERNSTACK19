import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCouponAction } from '../../State/Coupon/CouponActions';

const CouponComponent = ({ applyDiscount }) => {
    const dispatch = useDispatch();
    const coupon = useSelector(state => state.couponReducer.value);

    const generateCoupon = () => {
        const randomCoupon = Math.floor(100000 + Math.random() * 900000).toString();
        dispatch(generateCouponAction(randomCoupon));
        applyDiscount(10); // Apply a 10% discount when the coupon is generated
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <h2>Coupon Generator</h2>
            <p>Click the button below to generate a coupon and get 10% off your total amount!</p>
            <button onClick={generateCoupon}>Generate Coupon</button>
            {coupon && <p>Your Generated Coupon: <strong>{coupon}</strong></p>}
        </div>
    );
};

export default CouponComponent;