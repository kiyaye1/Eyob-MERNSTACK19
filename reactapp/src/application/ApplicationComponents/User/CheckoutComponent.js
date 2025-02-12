import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateCheckoutStatus } from "../../State/Cart/CartActions";
import { saveOrder } from "../../State/RecentOrder/recentOrdersActions";
import CouponComponent from "./CouponComponent";
import axiosInstance from "../../axiosConfig";

const CheckoutComponent = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.userReducer.user);
  const userName = user?.name;
  const userAddress = user?.street || "No address provided";
  const email = user?.email;
  
  const selectedItems = location.state?.selectedItems || [];

  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);

  useEffect(() => {
    const calculatedTotal = selectedItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 0;
      return sum + price * qty;
    }, 0);
    setTotalAmount(calculatedTotal);
  }, [selectedItems]);

  const applyDiscount = useCallback(
    (percentage) => {
      if (!isCouponApplied) {
        const discountAmount = (totalAmount * percentage) / 100;
        setDiscount(discountAmount);
        setIsCouponApplied(true);
      }
    },
    [totalAmount, isCouponApplied]
  );

  const handleMakePayment = useCallback(async () => {
    try {
      const orderData = {
        name: user.name,
        email: user.email,
        order: selectedItems,
        total: totalAmount,
        discount,
      };

      const responseData = await dispatch(saveOrder(orderData));

      await dispatch(updateCheckoutStatus(email, selectedItems));

      if (responseData.downloadLink) {
        setDownloadLink(responseData.downloadLink);
      }
      setIsPaymentDone(true);
    } catch (error) {
      console.error("Error processing payment:", error.message);
      alert("Failed to process payment. Please try again.");
    }
  }, [email, selectedItems, totalAmount, discount, dispatch]);

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(downloadLink, {
        responseType: "blob", // Ensures the response is treated as a file
      });
  
      // Create a downloadable URL from the blob
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
  
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Order_Receipt.pdf"); // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  if (isPaymentDone) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Payment Successful 🎉</h2>
        <p>Your payment has been processed successfully!</p>
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Delivery Information</h3>
          <p><strong>Name:</strong> {userName}</p>
          <p><strong>Address:</strong> {userAddress}</p>
          <p style={{ fontStyle: "italic", color: "green" }}>
            We will deliver your products to the above address. Thank you for shopping with us!
          </p>
        </div>
        {downloadLink && (
          <button onClick={handleDownload}>Download Your Order PDF 📄</button>
        )}
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
});

export default CheckoutComponent;
