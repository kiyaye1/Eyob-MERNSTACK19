import axiosInstance from "../../axiosConfig";
import * as actionTypes from "../ActionTypes";
import { addNotifications } from "../../State/Notification/NotificationActions";

// Add item from cart
export const addToCart = (product) => async (dispatch, getState) => {
  dispatch({
    type: actionTypes.ADD_TO_CART,
    payload: product,
  });

  const { cartItems } = getState().cartReducer;
    dispatch(addNotifications({ 
      id: new Date().getTime(), 
      message: `You added "${product.name}" to your cart. Total items: ${cartItems.length}`, 
      static: false 
    }));
};

// Remove item from cart
export const removeFromCart = (productId) => ({
  type: actionTypes.REMOVE_FROM_CART,
  payload: { productId },
});

// Remove from cart and save updated cart to the database
export const removeFromCartAndSave = (productId, userName) => {
  return async (dispatch, getState) => {
    try {
      // Remove item locally
      dispatch({
        type: actionTypes.REMOVE_FROM_CART,
        payload: productId,
      });

      // Fetch updated cart state
      const { cartItems } = getState().cartReducer;

      // Save updated cart to the database
      const response = await axiosInstance.post(
        "/cart/saveUserCart",
        {
          userid: userName,
          cart: cartItems,
        }
      );

      dispatch({
        type: actionTypes.SAVE_USER_CART_SUCCESS,
        payload: response.data,
      });

      alert("Item removed from cart & database updated successfully.");
    } catch (error) {
      console.error("Error removing item or saving cart:", error.message);

      dispatch({
        type: actionTypes.SAVE_USER_CART_FAILURE,
        payload: error.message,
      });

      alert("Failed to remove item from cart. Please try again.");
    }
  };
};

// Edit quantity of cart item
export const editCartItem = (productId, quantity) => ({
  type: actionTypes.EDIT_CART_ITEM,
  payload: { productId, quantity },
});

// Save cart to the database
export const saveUserCart = (userId, cartItems) => {
  return async (dispatch) => {
    try {
      const updatedCartItems = cartItems.map((item) => ({
        ...item,
        checkout: item.checkout || false, 
      }));

      const response = await axiosInstance.post(
        "/cart/saveUserCart",
        {
          userid: userId,
          cart: updatedCartItems,
        }
      );

      dispatch({
        type: actionTypes.SAVE_USER_CART_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_USER_CART_FAILURE,
        payload: error.message,
      });
      alert("Failed to save cart. Please try again.");
    }
  };
};

// Fetch user cart from the database
export const fetchUserCart = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "/cart/getUserCart",
        { userid: userId }
      );

      const cartDoc = response.data;

      if (cartDoc && cartDoc.cart) {
        const filteredCart = cartDoc.cart.filter((item) => !item.checkout);

        const normalized = filteredCart.map((item) => ({
          ...item,
          id: item.id || item._id,
        }));

        dispatch({
          type: actionTypes.FETCH_USER_CART_SUCCESS,
          payload: normalized,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_USER_CART_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_USER_CART_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Mark items as checked out
export const updateCheckoutStatus = (userId, items) => {
  return async (dispatch) => {
    try {
      const itemIds = items.map((item) => item.id);

      await axiosInstance.post("/cart/mark-checkedout", {
        userId,
        itemIds,
      });

      dispatch({
        type: actionTypes.MARK_ITEMS_CHECKED_OUT,
        payload: itemIds,
      });

      alert("Items marked as checked out successfully.");
    } catch (error) {
      console.error("Error marking items as checked out:", error.message);
      alert("Failed to mark items as checked out. Please try again.");
    }
  };
};

// Save order to the database
export const saveOrder = (orderDetails) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "/orders/saveOrder",
        orderDetails
      );

      dispatch({
        type: actionTypes.SAVE_ORDER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_ORDER_FAILURE,
        payload: error.message,
      });

      console.error("Error saving order:", error.message);
    }
  };
};
