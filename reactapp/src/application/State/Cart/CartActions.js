import axios from "axios";
import * as actionTypes from "../ActionTypes";

export const addToCart = (product) => ({
    type: actionTypes.ADD_TO_CART, // Action type for adding to cart
    payload: product, // The product to be added
});

export const removeFromCart = (productId)=>{
    return {
        type : actionTypes.REMOVE_FROM_CART,
        payload : {productId}
    }
}

export const removeFromCartAndSave = (productId, userName) => {
    return async (dispatch, getState) => {
        try {
            // Dispatch an action to remove the item from the Redux state
            dispatch({
                type: actionTypes.REMOVE_FROM_CART,
                payload: productId,
            });

            // Get the updated cart items from the Redux state
            const { cartItems } = getState().cartReducer;

            // Send the updated cart to the backend
            const response = await axios.post(
                "http://localhost:9000/cart/saveUserCart",
                {
                    userid: userName,
                    cart: cartItems,
                }
            );

            // Dispatch an action for a successful cart save
            dispatch({
                type: actionTypes.SAVE_USER_CART_SUCCESS,
                payload: response.data,
            });

            alert("Item removed from cart & DB updated successfully.");
        } catch (error) {
            console.error("Error removing item or saving cart:", error.message);

            // Dispatch an action for a failed cart save
            dispatch({
                type: actionTypes.SAVE_USER_CART_FAILURE,
                payload: error.message,
            });

            alert("Failed to remove item from cart. Please try again.");
        }
    };
};

export const editCartItem = (productId, quantity) => ({
    type: actionTypes.EDIT_CART_ITEM, // Action type for editing a cart item
    payload: { productId, quantity }, // The product ID and the new quantity
});

export const saveUserCart = (userId, cartItems) => {
    return async (dispatch) => {
        try {
            // Send the cart data to the backend
            const response = await axios.post(
                "http://localhost:9000/cart/saveUserCart",
                {
                    userid: userId,
                    cart: cartItems, // The current state of the cart
                }
            );

            // Dispatch an action for a successful save
            dispatch({
                type: actionTypes.SAVE_USER_CART_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            // Dispatch an action for a failed save
            dispatch({
                type: actionTypes.SAVE_USER_CART_FAILURE,
                payload: error.message,
            });
            //throw error; // Re-throw the error to handle it in the component
        }
    };
};

export const fetchUserCart = (userId) => {
    return async (dispatch) => {
        try {
            // Send a request to get the cart data
            const response = await axios.post(
                "http://localhost:9000/cart/getUserCart",
                { userid: userId }
            );

            const cartDoc = response.data;

            if (cartDoc && cartDoc.cart) {
                // Ensure item IDs are consistent --- id if available, otherwise _id
                const normalized = cartDoc.cart.map((item) => ({
                    ...item,
                    id: item.id || item._id,  
                }));

                // Dispatch an action for a successful fetch
                dispatch({
                    type: actionTypes.FETCH_USER_CART_SUCCESS,
                    payload: normalized,
                });
            } else {
                // If no cart is found, dispatch an empty cart
                dispatch({
                    type: actionTypes.FETCH_USER_CART_SUCCESS,
                    payload: [],
                });
            }
        } catch (error) {
            // Dispatch an action for a failed fetch
            dispatch({
                type: actionTypes.FETCH_USER_CART_FAILURE,
                payload: error.message,
            });
        }
    };
};
