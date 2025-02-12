import * as actionTypes from "../ActionTypes";

const initialState = {
    cartItems: [], 
    error: null,   
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TO_CART: {
            // Extract the product from the action payload
            const newProduct = action.payload;

            // Check if the product already exists in the cart
            const existingItem = state.cartItems.find(
                (item) => item.id === newProduct.id
            );

            if (existingItem) {
                // If the product exists, update its quantity
                const updatedItems = state.cartItems.map((item) =>
                    item.id === newProduct.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 } 
                        : item
                );
                return { ...state, cartItems: updatedItems };
            } else {
                // If the product doesn't exist, add it to the cart
                // Ensure the product has a valid price before adding
                if (newProduct.price && newProduct.price > 0) {
                    return {
                        ...state,
                        cartItems: [...state.cartItems, { ...newProduct, quantity: 1 }],
                    };
                }
                return state; // Return unchanged state if price is invalid
            }
        }

        case actionTypes.REMOVE_FROM_CART:
            // Remove the product from the cart based on its ID
            return {
                ...state,
                cartItems: state.cartItems.filter((item) => item.id !== action.payload),
            };

        case actionTypes.EDIT_CART_ITEM: {
            // Extract the product ID and new quantity from the payload
            const { productId, quantity } = action.payload;

            // Update the quantity of the product in the cart
            return {
                ...state,
                cartItems: state.cartItems.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: Math.max(quantity, 1) } // Ensure quantity is at least 1
                        : item
                ),
            };
        }

        case actionTypes.SAVE_USER_CART_SUCCESS:
            // Clear any errors when the cart is successfully saved
            return { ...state, error: null };

        case actionTypes.SAVE_USER_CART_FAILURE:
            // Set an error message when saving the cart fails
            return { ...state, error: action.payload };

        case actionTypes.FETCH_USER_CART_SUCCESS:
            // Update the cart with fetched data and clear any errors
            return {
                ...state,
                cartItems: action.payload,
                error: null,
            };

        case actionTypes.FETCH_USER_CART_FAILURE:
            // Set an error message when fetching the cart fails
            return { ...state, error: action.payload };

        default:
            // Return the unchanged state for unrecognized action types
            return state;
    }
};

export default cartReducer;
