import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateCheckoutStatus } from "../../State/Cart/CartActions";
import { saveOrder } from "../../State/RecentOrder/recentOrdersActions";
import CouponComponent from "./CouponComponent";

const CheckoutComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const navigate = useNavigate();

  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const userName = user?.userName;

  useEffect(() => {
    const calculatedTotal = selectedItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 0;
      return sum + price * qty;
    }, 0);
    setTotalAmount(calculatedTotal);
  }, [selectedItems]);

  const applyDiscount = (percentage) => {
    const discountAmount = (totalAmount * percentage) / 100;
    setDiscount(discountAmount);
  };

  const handleMakePayment = async () => {
    try {
      const orderData = {
        userId: userName,
        order: selectedItems,
        total: totalAmount - discount,
        discount,
      };
  
      // Save the order in the database
      await dispatch(saveOrder(orderData));
  
      // Mark items as checked out in the cart
      await dispatch(updateCheckoutStatus(userName, selectedItems));
  
      // Payment success logic
      setIsPaymentDone(true);
    } catch (error) {
      console.error("Error processing payment:", error.message);
      alert("Failed to process payment. Please try again.");
    }
  };
  

  if (isPaymentDone) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Payment Successful</h2>
        <p>Your payment has been processed successfully!</p>
        <button onClick={() => navigate("/")}>Go Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>
      {selectedItems.length === 0 ? (
        <p>No items selected for checkout.</p>
      ) : (
        <div>
          <table border="1" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <CouponComponent applyDiscount={applyDiscount} />

          <div>
            <h3>Summary</h3>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
            <p>Discount: -${discount.toFixed(2)}</p>
            <p>Payable: ${(totalAmount - discount).toFixed(2)}</p>
            <button onClick={handleMakePayment}>Make Payment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutComponent;
