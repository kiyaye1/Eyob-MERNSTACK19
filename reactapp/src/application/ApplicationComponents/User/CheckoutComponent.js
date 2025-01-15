import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../../State/User/UserActions";
import CouponComponent from "./CouponComponent";

const CheckoutComponent = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userReducer.user);
    const cartItems = useSelector((state) => state.cartReducer.cartItems);

    const [isPaymentDone, setIsPaymentDone] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);

    const userName = user?.userName;

    useEffect(() => {
        if (userName) {
            dispatch(fetchUserData(userName));
        }
    }, [userName, dispatch]);

    useEffect(() => {
        const calculatedTotal = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.quantity, 10) || 0;
            return sum + price * qty;
        }, 0);
        setTotalAmount(calculatedTotal);
    }, [cartItems]);

    const applyDiscount = (percentage) => {
        const discountAmount = (totalAmount * percentage) / 100;
        setDiscount(discountAmount);
    };

    const handleMakePayment = () => {
        setIsPaymentDone(true);
    };

    if (isPaymentDone) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Payment Page</h2>
                <p>Thank you for the payment, your items are under process!</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Checkout Page</h2>

            {cartItems.length === 0 ? (
                <p style={{ marginTop: "20px" }}>No items in the cart.</p>
            ) : (
                <div style={{ marginTop: "20px" }}>
                    <h3>
                        Delivering products to: {" "}
                        <span style={{ fontWeight: "normal" }}>
                            {user?.street || "No address available"}
                        </span>
                    </h3>
                    <h4>Contact: {user?.mobile || "No phone number available"}</h4>

                    <table border="1" style={{ width: "100%", textAlign: "left", marginBottom: "20px" }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Rating</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>${parseFloat(item.price || 0).toFixed(2)}</td>
                                    <td>{item.description}</td>
                                    <td>{item.rating}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        {((parseFloat(item.price) || 0) * (item.quantity || 0)).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <CouponComponent applyDiscount={applyDiscount} />

                    <div style={{ textAlign: "left" }}>
                        <h3>Purchase Summary</h3>
                        <p>
                            <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
                        </p>
                        <p>
                            <strong>Discount:</strong> -${discount.toFixed(2)}
                        </p>
                        <p>
                            <strong>Amount Payable:</strong> ${(totalAmount - discount).toFixed(2)}
                        </p>
                        <button onClick={handleMakePayment}>Make Payment</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutComponent;