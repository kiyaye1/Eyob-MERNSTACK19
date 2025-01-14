import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsFromDB, SaveProductToDBUsingAxios } from "../../State/Product/ProductActions";
import { addToCart } from "../../State/Cart/CartActions";

const ProductComponent = () => {
    // Initialize Redux dispatch 
    const dispatch = useDispatch();

    // Access products from Redux state
    const products = useSelector((state) => state.productReducer.products);

    // Local state for controlling the alert visibility
    const [showAlert, setShowAlert] = useState(false);

    // Refs for capturing form input values
    const productNameRef = useRef(null);
    const priceRef = useRef(null);
    const descriptionRef = useRef(null);
    const ratingRef = useRef(null);

    // Fetch products from the database when the component mounts
    useEffect(() => {
        dispatch(fetchProductsFromDB());
    }, [dispatch]);

    // Function to save a new product to the database
    const saveProduct = () => {
        const newProduct = {
            name: productNameRef.current.value,
            price: parseFloat(priceRef.current.value),
            description: descriptionRef.current.value,
            rating: parseFloat(ratingRef.current.value),
        };
        // Dispatch the action to save the product and show the success alert
        dispatch(SaveProductToDBUsingAxios(newProduct)).then(() => {
            setShowAlert(true);
        });
    };

    // Close the alert and refresh the product list
    const closeAlert = () => {
        setShowAlert(false);
        dispatch(fetchProductsFromDB());
    };

    // Handle adding a product to the cart
    const addToCartHandler = (product) => {
        console.log("Add to cart product:", product);
        dispatch(addToCart(product));
        alert(`${product.name} added to cart (local only, not saved to DB yet).`);
    };

    return (
        <div>
            <h2>Product Management</h2>

            {/* Section for adding a new product */}
            <div style={{ marginBottom: "40px" }}>
                <h3>Add a New Product</h3>
                <div>
                    <label>Product Name:</label>
                    <input type="text" ref={productNameRef} />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" ref={priceRef} />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea ref={descriptionRef}></textarea>
                </div>
                <div>
                    <label>Rating:</label>
                    <input type="number" ref={ratingRef} min="1" max="5" />
                </div>
                <button onClick={saveProduct} style={{ marginTop: "10px" }}>
                    Save Product
                </button>
            </div>

            {/* Success alert for product creation */}
            {showAlert && (
                <div
                    style={{
                        marginBottom: "20px",
                        backgroundColor: "#d4edda",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #c3e6cb",
                    }}
                >
                    <p>Product has been saved successfully!</p>
                    <button onClick={closeAlert} style={{ marginTop: "10px" }}>
                        OK
                    </button>
                </div>
            )}

            {/* Section to display available products */}
            <div>
                <h3>Available Products</h3>
                {products && products.length > 0 ? (
                    <table border="1" style={{ width: "100%", textAlign: "left" }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Rating</th>
                                <th>Add to Cart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.description}</td>
                                    <td>{product.rating} / 5</td>
                                    <td>
                                        <button onClick={() => addToCartHandler(product)}>
                                            Add to Cart
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        No products available. Please add products to the database.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductComponent;
