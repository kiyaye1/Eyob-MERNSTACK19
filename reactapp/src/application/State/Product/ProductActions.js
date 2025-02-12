import * as actionTypes from "../ActionTypes";
import axiosInstance from "../../axiosConfig";

export const AddProductToStore = (product) => ({
  type: actionTypes.ADD_PRODUCT_TO_STORE, // Action type for adding a product
  payload: product, // The product object to be added
});

export const fetchProductsSuccess = (products) => ({
  type: actionTypes.FETCH_PRODUCTS_SUCCESS, // Action type for successful fetch
  payload: products, // Array of products fetched from the database
});

export const SaveProductToDBUsingAxios = (productObj) => {
  return async (dispatch) => {
    try {
      // Make a POST request to save the product to the database
      const response = await axiosInstance.post(
        "/product/createProducts",
        productObj
      );

      // Extract the product data from the response
      const newProduct = response.data;

      // Dispatch an action to add the new product to the Redux store
      dispatch(AddProductToStore(newProduct));

      // Return the new product for further use (optional)
      return newProduct;
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
};

export const fetchProductsFromDB = () => {
  return async (dispatch) => {
    try {
      // Make a GET request to fetch all products from the database
      const response = await axiosInstance.get(
        "/product/fetchProducts"
      );

      // Dispatch an action with the fetched products
      dispatch(fetchProductsSuccess(response.data));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
};