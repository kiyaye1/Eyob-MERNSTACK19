import axiosInstance from "../../axiosConfig";
import * as actionTypes from "../ActionTypes";
import { addNotifications } from "../../State/Notification/NotificationActions";

// Save a new order
export const saveOrder = (orderData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/recent-orders", orderData);

    // Dispatch the full response data
    dispatch({
      type: actionTypes.SAVE_ORDER_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (err) {
    console.error("Failed to save order:", err.response ? err.response.data : err.message);
    alert("Failed to save order: " + (err.response ? JSON.stringify(err.response.data) : err.message));
    throw err;
  }
};

// Fetch recent orders
export const fetchRecentOrders = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/recent-orders");
    dispatch({
      type: actionTypes.FETCH_ORDERS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error("Failed to fetch orders:", err.message);
  }
};

// Cancel an order
export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/recent-orders/${orderId}/cancel`);
    dispatch({
      type: actionTypes.CANCEL_ORDER_SUCCESS,
      payload: response.data.order,
    });

    dispatch(
      addNotifications({
        id: new Date().getTime(),
        message: "Reorder items if needed",
        static: false,
      })
    );

    return response.data.order;
  } catch (err) {
    console.error("Failed to cancel order:", err.message);
    throw err;
  }
};

// Reorder an order
export const reorderOrder = (orderId) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/recent-orders/${orderId}/reorder`);
    dispatch({
      type: actionTypes.REORDER_ORDER_SUCCESS,
      payload: response.data.order,
    });
    return response.data.order;
  } catch (err) {
    console.error("Failed to reorder order:", err.message);
    throw err;
  }
};

// Deliver an order
export const deliverOrder = (orderId) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/recent-orders/${orderId}/deliver`);
    dispatch({
      type: actionTypes.DELIVER_ORDER_SUCCESS,
      payload: response.data.order,
    });

    dispatch(
      addNotifications({
        id: new Date().getTime(),
        message: "Leave a review for purchased products!",
        static: false,
      })
    );

    return response.data.order;
  } catch (err) {
    console.error("Failed to deliver order:", err.message);
    throw err;
  }
};

// Update an order's status
export const updateOrderStatus = (orderId, updates) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/recent-orders/${orderId}`, updates);
    dispatch({
      type: actionTypes.UPDATE_ORDER_STATUS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (err) {
    console.error("Failed to update order status:", err.message);
    throw err;
  }
};