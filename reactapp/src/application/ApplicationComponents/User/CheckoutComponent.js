
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../../State/User/UserActions"; 

const CheckoutComponent = () => {

    const dispatch = useDispatch();
    
    const user = useSelector((state) => state.userReducer.user); // Read user info from store
    
    const cartItems = useSelector((state) => state.cartReducer.cartItems); // Read cart items from store
    
    const [isPaymentDone, setIsPaymentDone] = useState(false); // Local state to track if payment is done
    
    const userName = user.userName;

    // Fetch user details from DB
    useEffect(() => {
        if (userName) {
        dispatch(fetchUserData(userName));
        }
    }, [userName, dispatch]);

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity, 10) || 0;
        return sum + price * qty;
    }, 0);

    // Calculate total products count
    const totalProductsCount = cartItems.reduce((count, item) => {
        const qty = parseInt(item.quantity, 10) || 0;
        return count + qty;
    }, 0);

    // Handler for making the payment
    const handleMakePayment = () => {
        setIsPaymentDone(true);
    };

    // If payment is completed, show the Payment Page
    if (isPaymentDone) {
        return (
        <div style={{ padding: "20px" }}>
            <h2>Payment Page</h2>
            <p>Thank you for the payment, your items are under process!</p>
        </div>
        );
    }

    // Otherwise, show the normal checkout page
    return (
        <div style={{ padding: "20px" }}>
        <h2>Checkout Page</h2>

        {/* If cart is empty, show only this message */}
        {cartItems.length === 0 ? (
            <p style={{ marginTop: "20px" }}>No items in the cart.</p>
        ) : (
            // Otherwise, show user details and cart info 
            <div style={{ marginTop: "20px" }}>
            <h3>
                Delivering products to:{" "}
                <span style={{ fontWeight: "normal" }}>
                {user?.street || "No address available"}
                </span>
            </h3>
            <h4>Contact: {user?.mobile || "No phone number available"}</h4>
            {/* Table of cart items */}
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

            {/* Purchase Summary */}
            <div style={{ textAlign: "left" }}>
                <h3>Purchase Summary</h3>
                <p>
                <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
                </p>
                <p>
                <strong>Total Products Count:</strong> {totalProductsCount}
                </p>
                <button onClick={handleMakePayment}>Make Payment</button>
            </div>
            </div>
        )}
        </div>
    );
};

export default CheckoutComponent;
