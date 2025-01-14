import * as actionTypes from "../ActionTypes";
import axios from "axios";

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
            const response = await axios.post(
                "http://localhost:9000/product/createProducts",
                productObj
            );

            // Extract the product data from the response 
            const newProduct = {
                id: response.data._id, // Use the database's unique ID
                name: response.data.name,
                price: response.data.price,
                description: response.data.description,
                rating: response.data.rating,
            };

            // Dispatch an action to add the new product to the Redux store
            dispatch(AddProductToStore(newProduct));

            // Return the new product for further use (optional)
            return newProduct;
        } catch (error) {
            console.error("Error saving product:", error);
            //throw error; // Rethrow the error to handle it in the calling component
        }
    };
};

export const fetchProductsFromDB = () => {
    return async (dispatch) => {
        try {
            // Make a GET request to fetch all products from the database
            const response = await axios.get(
                "http://localhost:9000/product/fetchProducts"
            );

            // Dispatch an action with the fetched products
            dispatch(fetchProductsSuccess(response.data));
        } catch (error) {
            console.error("Error fetching products:", error); 
        }
    };
};
