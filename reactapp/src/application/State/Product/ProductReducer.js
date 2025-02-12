import * as actionTypes from '../ActionTypes';

// Initial state for the product reducer
const initialState = {
  product: {
    name: "",
    price: 0,
    description: "",
    rating: 0,
    checkout: false,
    reviews: [],
  },
  products: [], // Array to store the list of all products
};

const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PRODUCT_TO_STORE: // Action to add a new product to the Redux store
      return {
        ...state, // Preserve the current state
        product: action.payload, // Update the single product in the state
        products: [...state.products, action.payload], // Append the new product to the products list
      };

    case actionTypes.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state, // Preserve the current state
        products: action.payload, // Replace the products array with the fetched data
      };

    default:
      // Return the unchanged state for unrecognized action types
      return state;
  }
};

export default ProductReducer;