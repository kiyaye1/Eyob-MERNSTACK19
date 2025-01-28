import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentOrders, cancelOrder } from "../../State/RecentOrder/recentOrdersActions";
import axios from "axios";

const RecentOrders = () => {
  const dispatch = useDispatch();

  const recentOrders = useSelector((state) => state.recentOrdersReducer.recentOrders) || [];
  const loggedInUsername = useSelector((state) => state.userReducer.user.userName);
  const userOrders = recentOrders.filter((order) => order.userId === loggedInUsername);

  const [ordersWithTimers, setOrdersWithTimers] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });

  const [cart, setCart] = useState([]);

  useEffect(() => {
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  useEffect(() => {
    const timers = [];

    const userOrders = recentOrders.filter((order) => order.userId === loggedInUsername);

    const updatedOrders = userOrders.map((order) => {
      const now = new Date();
      const orderDate = new Date(order.dateTime);

      const timeElapsed = (now - orderDate) / (1000 * 60 * 60 * 24);
      const timeRemaining = 0.00035 - timeElapsed;

      if (order.status !== "Cancelled" && timeRemaining > 0) {
        const timer = setTimeout(async () => {
          try {
            await updateRecentOrderCollection(order._id, { status: "Delivered" });
            await removeItemsFromCart(order._id); // Remove delivered items from the cart
            await dispatch(fetchRecentOrders());
          } catch (err) {
            console.error(`Failed to update order ${order._id} to Delivered:`, err.message);
          }
        }, timeRemaining * 24 * 60 * 60 * 1000);

        timers.push(timer);
      }

      return {
        ...order,
        isExpired: order.status !== "Cancelled" && timeElapsed >= 0.00035,
        canBeCancelled: order.status === "Pending",
      };
    });

    setOrdersWithTimers(updatedOrders);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [recentOrders, loggedInUsername, dispatch]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const handleReview = (productId) => {
    setReviewData((prev) => ({ ...prev, productId })); // Store the product ID
    setShowReviewModal(true); // Open the modal
  };
  
  const submitReview = async () => {
    try {
      const { productId } = reviewData; // Retrieve the product ID
      if (!productId) {
        alert("Error: No product selected for review.");
        return;
      }
  
      const response = await axios.post(
        `http://localhost:9000/product/add-review/${productId}`,
        {
          userId: loggedInUsername,
          userName: loggedInUsername,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }
      );
  
      setShowReviewModal(false); // Close the modal
      setReviewData({ rating: 0, comment: "", productId: null }); // Reset review data
      alert("Review submitted successfully!");
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
  
      const canceledOrder = await dispatch(cancelOrder(orderId));
  
      setOrdersWithTimers((prevOrders) =>
        prevOrders.map((order) =>
          order._id === canceledOrder._id ? { ...order, status: "Cancelled" } : order
        )
      );
  
      alert("Order cancelled successfully!");
    } catch (err) {
      alert("Failed to cancel the order. Please try again.");
    }
  };

  const handleReorder = async (orderId) => {
    try {
      const reorderedOrder = ordersWithTimers.find((order) => order._id === orderId);
  
      if (reorderedOrder) {
        const productIds = reorderedOrder.order.map((item) => item.id);
  
        // Update the cart items in the backend
        await updateCartItems(loggedInUsername, productIds, true); // Set checkout flag to true
  
        // Update the order status
        await updateRecentOrderCollection(orderId, {
          status: "Pending",
          dateTime: new Date().toISOString(),
        });
  
        // Re-fetch recent orders
        await dispatch(fetchRecentOrders());
  
        // Re-fetch cart data to reflect updated checkout flags
        const updatedCart = await axios.get("http://localhost:9000/cart", {
          params: { userId: loggedInUsername },
        });
  
        setCart(updatedCart.data.cart);
  
        alert("Order reordered successfully!");
      }
    } catch (err) {
      alert("Failed to reorder the order. Please try again.");
    }
  };
  
  const removeItemsFromCart = async (orderId) => {
    try {
      const deliveredOrder = ordersWithTimers.find((order) => order._id === orderId);
  
      if (deliveredOrder) {
        const productIds = deliveredOrder.order.map((item) => item.id);
  
        await axios.put("http://localhost:9000/cart/remove-items", {
          userId: loggedInUsername,
          productIds,
        });
  
        console.log(`Successfully removed items for order ${orderId}`);
      }
    } catch (err) {
      console.error(`Failed to remove items from cart for order ${orderId}:`, err.message);
    }
  };
  
  const updateCartItems = async (userId, productIds, checkoutStatus) => {
    try {
      const response = await axios.put("http://localhost:9000/cart/update-checkout", {
        userId,
        productIds,
        checkout: checkoutStatus, 
      });
    } catch (err) {
      console.error("Error updating cart items:", err.message);
    }
  };

  const updateRecentOrderCollection = async (orderId, updates) => {
    try {
      await axios.put(`http://localhost:9000/recent-orders/${orderId}`, updates);
    } catch (err) {
      console.error(`Failed to update order ${orderId}:`, err);
    }
  };

  const renderOrderDetails = (order) => {
    const totalBeforeDiscount = order.order.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return (
      <tr>
        <td colSpan="5">
          <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
            <h4>Order Details:</h4>
            {order.order.map((item, index) => (
              <p key={index} style={{ marginBottom: "10px" }}>
                <strong>Product Name:</strong> {item.name} <br />
                <strong>Quantity:</strong> {item.quantity} <br />
                <strong>Price:</strong> ${item.price.toFixed(2)} <br />
                <strong>Total (Before Discount):</strong> ${(item.price * item.quantity).toFixed(2)} <br />
                <strong>Total (After Discount):</strong> $
                {(
                  item.price * item.quantity -
                  (item.price * item.quantity / totalBeforeDiscount) * order.discount
                ).toFixed(2)} <br />
              </p>
            ))}
          </div>
        </td>
      </tr>
    );
  };

  const renderOrders = (title, orders, showActions, showReorder) => {
    if (orders.length === 0) return null;

    return (
      <>
        <h3>{title}</h3>
        <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date/Time Created</th>
              <th>Product Name</th>
              <th>Total</th>
              {(showActions || showReorder) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td>{order._id}</td>
                  <td>{new Date(order.dateTime).toLocaleString()}</td>
                  <td>{order.order.map((item) => item.name).join(", ")}</td>
                  <td>${order.total.toFixed(2)}</td>
                  {(showActions || showReorder) && (
                    <td>
                      {showActions && (
                        <>
                          <button onClick={() => toggleExpandOrder(order._id)}>
                            {expandedOrderId === order._id ? "Hide Details" : "View Details"}
                          </button>
                          {order.status === "Delivered" && order.order.map((item) => (
                            <button key={item.id} onClick={() => {handleReview(item.id);}}>
                              Rate & Review - {item.name}
                            </button>
                          ))}
                          {order.canBeCancelled && !order.isExpired && (
                            <button onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                          )}
                        </>
                      )}
                      {showReorder && (
                        <>
                          <button onClick={() => toggleExpandOrder(order._id)}>
                            View Details
                          </button>
                          <button onClick={() => handleReorder(order._id)}>
                            Reorder
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
                {expandedOrderId === order._id && renderOrderDetails(order)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const pendingOrders = ordersWithTimers.filter((order) => order.status === "Pending");
  const deliveredOrders = ordersWithTimers.filter(
    (order) => order.status === "Delivered" && !pendingOrders.some((o) => o._id === order._id)
  );
  const cancelledOrders = ordersWithTimers.filter((order) => order.status === "Cancelled");

  return (
    <div style={{ padding: "20px" }}>
      {userOrders.length === 0 ? (
        <h2>No recent orders available.</h2>
      ) : (
        <>
          {renderOrders("Pending Orders", pendingOrders, true, false)}
          {renderOrders("Delivered Orders", deliveredOrders, true, false)}
          {renderOrders("Cancelled Orders", cancelledOrders, false, true)}
        </>
      )}
      {showReviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
        <h3>Submit Review</h3>
        <div>
          <label>
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            value={reviewData.rating || ""} // Default to an empty string if `rating` is falsy
            onChange={(e) =>
              setReviewData((prev) => ({
              ...prev,
              rating: parseFloat(e.target.value) || 0, // Parse value as a float, default to 0 if NaN
              }))
            }
          />
          </label>
        </div>
        <div>
          <label>
            Comment:
            <textarea
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, comment: e.target.value }))
              }
              style={{ width: "100%", height: "80px" }}
            ></textarea>
          </label>
        </div>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button onClick={submitReview} style={{ marginRight: "10px" }}>
            Submit
          </button>
          <button onClick={() => setShowReviewModal(false)}>Cancel</button>
        </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
