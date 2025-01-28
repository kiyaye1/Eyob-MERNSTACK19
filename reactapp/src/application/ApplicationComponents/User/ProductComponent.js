import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsFromDB, SaveProductToDBUsingAxios } from "../../State/Product/ProductActions";
import { addToCart, saveUserCart } from "../../State/Cart/CartActions";

const ProductComponent = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) =>
    state.productReducer.products.filter((product) => !product.checkout)
  );
  const cartItems = useSelector((state) => state.cartReducer.cartItems) || [];
  const user = useSelector((state) => state.userReducer.user);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [expandedProductId, setExpandedProductId] = useState(null);

  const productNameRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const ratingRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductsFromDB());
  }, [dispatch]);

  const saveProduct = () => {
    const name = productNameRef.current.value.trim();
    const price = parseFloat(priceRef.current.value);
    const description = descriptionRef.current.value.trim();
    const rating = parseFloat(ratingRef.current.value || 5);

    if (!name || isNaN(price) || price <= 0 || !description) {
        setAlertMessage("Please fill out all fields with valid values.");
        setShowAlert(true);
        return;
    }

    const newProduct = { name, price, description, rating, checkout: false };

    dispatch(SaveProductToDBUsingAxios(newProduct))
        .then(() => {
            setAlertMessage("Product has been saved successfully!");
            setShowAlert(true);

            // Clear the form fields after successfully saving the product
            productNameRef.current.value = "";
            priceRef.current.value = "";
            descriptionRef.current.value = "";
            ratingRef.current.value = "";
        })
        .catch((err) => {
            setAlertMessage("Failed to save the product. Please try again.");
            setShowAlert(true);
            console.error("Error saving product:", err);
        });
  };

  const closeAlert = () => {
    setShowAlert(false);
    if (alertMessage === "Product has been saved successfully!") {
      dispatch(fetchProductsFromDB());
    }
  };

  const addToCartHandler = (product) => {
    if (!user?.userName) {
      alert("You must log in to add items to the cart.");
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      dispatch(addToCart({ ...existingItem, quantity: existingItem.quantity + 1 }));
    } else {
      const newCartItem = { ...product, quantity: 1, checkout: false };
      updatedCart = [...cartItems, newCartItem];
      dispatch(addToCart(newCartItem));
    }

    dispatch(saveUserCart(user.userName, updatedCart))
      .then(() => {
        alert(`${product.name} has been added to your cart and saved to the database.`);
      })
      .catch((error) => {
        console.error("Error saving cart to database:", error.message);
        alert("Failed to save cart to the database. Please try again.");
      });
  };

  const toggleExpandReviews = (productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  return (
    <div>
      <h2>Product Management</h2>

      {user?.userName === "Admin" && (
        <div style={{ marginBottom: "40px" }}>
          <h3>Add a New Product</h3>
          <div>
            <label>Product Name:</label>
            <input type="text" ref={productNameRef} />
          </div>
          <div>
            <label>Price:</label>
            <input type="number" ref={priceRef} min="0" step="0.01" />
          </div>
          <div>
            <label>Description:</label>
            <textarea ref={descriptionRef}></textarea>
          </div>
          <div>
            <label>Rating:</label>
            <input type="number" ref={ratingRef} min="1" max="5" step="0.1" />
          </div>
          <button onClick={saveProduct} style={{ marginTop: "10px" }}>
            Save Product
          </button>
        </div>
      )}

      {showAlert && (
        <div
          style={{
            marginBottom: "20px",
            backgroundColor: "#f8d7da",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #f5c6cb",
          }}
        >
          <p>{alertMessage}</p>
          <button onClick={closeAlert} style={{ marginTop: "10px" }}>
            OK
          </button>
        </div>
      )}

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
                <th>Reviews</th>
                <th>Add to Cart</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.description}</td>
                  <td>{product.rating.toFixed(1)} / 5</td>
                  <td>
                    <button onClick={() => toggleExpandReviews(product.id)}>
                      {expandedProductId === product.id ? "Hide Reviews" : "View Reviews"}
                    </button>
                    {expandedProductId === product.id && (
                      <div style={{ marginTop: "10px", border: "1px solid #ddd", padding: "10px" }}>
                        {product.reviews.length > 0 ? (
                          product.reviews.map((review, index) => (
                            <div
                              key={index}
                              style={{
                                marginBottom: "15px",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <p>
                                <strong>{review.userName}:</strong> {review.comment}
                              </p>
                              <p>Rating: {review.rating} / 5</p>
                              <p style={{ fontSize: "0.9em", color: "#888" }}>
                                {new Date(review.date).toLocaleString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No reviews yet</p>
                        )}
                      </div>
                    )}
                  </td>
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
