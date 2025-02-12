import React, { useEffect, useState, useCallback, useMemo, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentOrders, cancelOrder } from "../../State/RecentOrder/recentOrdersActions";
import { addNotifications } from "../../State/Notification/NotificationActions";
import axiosInstance from "../../axiosConfig";

const RecentOrders = React.memo(() => {
  const dispatch = useDispatch();

  const recentOrders = useSelector((state) => state.recentOrdersReducer.recentOrders) || [];
  const loggedInUsername = useSelector((state) => state.userReducer.user.email);
  const loggedInName = useSelector((state) => state.userReducer.user.name);

  // Memoize userOrders to avoid creating a new array each render
  const userOrders = useMemo(() => {
    return recentOrders
      .filter((order) => order.userId === loggedInUsername)
      .map(order => ({ ...order })) // Creates a new array to prevent mutation
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }, [recentOrders, loggedInUsername]);

  const [ordersWithTimers, setOrdersWithTimers] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });

  const [cart, setCart] = useState([]);

  // Fetch recent orders on mount
  useEffect(() => {
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  // Set timers to handle delivery logic
  useEffect(() => {
    // Filter orders for this user
    const myUserOrders = recentOrders.filter((order) => order.userId === loggedInUsername);
    const timers = [];

    const updatedOrders = myUserOrders.map((order) => {
      const now = new Date();
      const orderDate = new Date(order.dateTime);

      // Time difference in days
      const timeElapsed = (now - orderDate) / (1000 * 60 * 60 * 24);
      const timeRemaining = 0.00035 - timeElapsed; 

      if (order.status !== "Cancelled" && timeRemaining > 0) {
        const timer = setTimeout(async () => {
          try {
            await updateRecentOrderCollection(order._id, { status: "Delivered" });
            dispatch(
              addNotifications({
                id: new Date().getTime(),
                message: "Leave a review for purchased products!",
                static: false,
              })
            );
            await removeItemsFromCart(order._id);
            await dispatch(fetchRecentOrders());
          } catch (err) {
            console.error(`Failed to update order ${order._id} to Delivered:, err.message`);
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

  const toggleExpandOrder = useCallback((orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  }, []);

  const handleReview = useCallback((productId) => {
    setReviewData((prev) => ({ ...prev, productId }));
    setShowReviewModal(true);
  }, []);

  const submitReview = useCallback(async () => {
    try {
      const { productId } = reviewData;
      if (!productId) {
        alert("Error: No product selected for review.");
        return;
      }
      await axiosInstance.post(`/product/add-review/${productId}`, {
        userId: loggedInUsername,
        name: loggedInName,
        email: loggedInUsername,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setShowReviewModal(false);
      setReviewData({ rating: 0, comment: "", productId: null });
      alert("Review submitted successfully!");
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    }
  }, [reviewData, loggedInUsername, loggedInName]);

  const handleCancelOrder = useCallback(
    async (orderId) => {
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
    },
    [dispatch]
  );

  const handleReorder = useCallback(
    async (orderId) => {
      try {
        const reorderedOrder = ordersWithTimers.find((order) => order._id === orderId);
        if (reorderedOrder) {
          const productIds = reorderedOrder.order.map((item) => item.id);

          await updateCartItems(loggedInUsername, productIds, true);

          await updateRecentOrderCollection(orderId, {
            status: "Pending",
            dateTime: new Date().toISOString(),
          });

          await dispatch(fetchRecentOrders());

          const updatedCart = await axiosInstance.get("/cart", {
            params: { userId: loggedInUsername },
          });
          setCart(updatedCart.data.cart);

          alert("Order reordered successfully!");
        }
      } catch (err) {
        alert("Failed to reorder the order. Please try again.");
      }
    },
    [ordersWithTimers, dispatch, loggedInUsername]
  );

  const removeItemsFromCart = useCallback(
    async (orderId) => {
      try {
        const deliveredOrder = ordersWithTimers.find((order) => order._id === orderId);
        if (deliveredOrder) {
          const productIds = deliveredOrder.order.map((item) => item.id);
          await axiosInstance.put("/cart/remove-items", {
            userId: loggedInUsername,
            productIds,
          });
          console.log(`Successfully removed items for order ${orderId}`);
        }
      } catch (err) {
        console.error(`Failed to remove items from cart for order ${orderId}:, err.message`);
      }
    },
    [ordersWithTimers, loggedInUsername]
  );

  const updateCartItems = useCallback(
    async (userId, productIds, checkoutStatus) => {
      try {
        await axiosInstance.put("/cart/update-checkout", {
          userId,
          productIds,
          checkout: checkoutStatus,
        });
      } catch (err) {
        console.error("Error updating cart items:", err.message);
      }
    },
    []
  );

  const updateRecentOrderCollection = useCallback(async (orderId, updates) => {
    try {
      await axiosInstance.put(`/recent-orders/${orderId}`, updates);
    } catch (err) {
      console.error(`Failed to update order ${orderId}:, err`);
    }
  }, []);

  const pendingOrders = useMemo(
    () => ordersWithTimers.filter((order) => order.status === "Pending"),
    [ordersWithTimers]
  );
  const deliveredOrders = useMemo(
    () =>
      ordersWithTimers.filter(
        (order) =>
          order.status === "Delivered" &&
          !pendingOrders.some((o) => o._id === order._id)
      ),
    [ordersWithTimers, pendingOrders]
  );
  const cancelledOrders = useMemo(
    () => ordersWithTimers.filter((order) => order.status === "Cancelled"),
    [ordersWithTimers]
  );

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
                <strong>Unit Price:</strong> ${item.price.toFixed(2)} <br />
                <strong>Total (Before Discount):</strong>{" "}
                {(item.price * item.quantity).toFixed(2)} <br />
                <strong>Total (After Discount):</strong>{" "}
                {(
                  item.price * item.quantity -
                  (item.price * item.quantity / totalBeforeDiscount) *
                    order.discount
                ).toFixed(2)}{" "}
                <br />
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
            {orders.map((order) => {
              // Calculate total before discount
              const totalBeforeDiscount = order.order.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              // Calculate total after discount
              const totalAfterDiscount = (totalBeforeDiscount - order.discount).toFixed(2);

              return (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>{order._id}</td>
                    <td>{new Date(order.dateTime).toLocaleString()}</td>
                    <td>{order.order.map((item) => item.name).join(", ")}</td>
                    <td>${totalAfterDiscount}</td>
                    {(showActions || showReorder) && (
                      <td>
                        {showActions && (
                          <>
                            <button onClick={() => toggleExpandOrder(order._id)}>
                              {expandedOrderId === order._id ? "Hide Details" : "View Details"}
                            </button>
                            {order.status === "Delivered" &&
                              order.order.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    handleReview(item.id);
                                  }}
                                >
                                  Rate &amp; Review - {item.name}
                                </button>
                              ))}
                            {order.status === "Pending" && (
                              <button onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                            )}
                          </>
                        )}
                        {showReorder && (
                          <>
                            <button onClick={() => toggleExpandOrder(order._id)}>
                              View Details
                            </button>
                            <button onClick={() => handleReorder(order._id)}>Reorder</button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                  {expandedOrderId === order._id && renderOrderDetails(order)}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      {userOrders.length === 0 ? (
        <p>No recent orders available.</p>
      ) : (
        <>
          {renderOrders("Pending Orders", userOrders.filter(o => o.status === "Pending"), true, false)}
          {renderOrders("Delivered Orders", userOrders.filter(o => o.status === "Delivered"), true, false)}
          {renderOrders("Cancelled Orders", userOrders.filter(o => o.status === "Cancelled"), false, true)}
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
            <label>
              Rating:
              <input
                type="number"
                min="1"
                max="5"
                value={reviewData.rating || ""}
                onChange={(e) =>
                  setReviewData((prev) => ({
                    ...prev,
                    rating: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </label>
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
            <button onClick={submitReview}>Submit</button>
            <button onClick={() => setShowReviewModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default RecentOrders;