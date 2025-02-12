import React, {useRef, useEffect, useState, useCallback, useMemo, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsFromDB,  SaveProductToDBUsingAxios, } from "../../State/Product/ProductActions";
import { addToCart, saveUserCart } from "../../State/Cart/CartActions";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const ProductComponent = React.memo(() => {
  const dispatch = useDispatch();

  // Get all products from store
  const rawProducts = useSelector((state) => state.productReducer.products);

  // Use useMemo to filter out checkout items only when rawProducts changes
  const products = useMemo(
    () => rawProducts.filter((product) => !product.checkout),
    [rawProducts]
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

  // Memoize saveProduct so it isn't re-created on every render
  const saveProduct = useCallback(() => {
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
  }, [dispatch]);

  // Closes the alert. If product was saved successfully, re-fetch
  const closeAlert = useCallback(() => {
    setShowAlert(false);
    if (alertMessage === "Product has been saved successfully!") {
      dispatch(fetchProductsFromDB());
    }
  }, [alertMessage, dispatch]);

  // Memoize add-to-cart logic
  const addToCartHandler = useCallback(
    (product) => {
      if (!user?.email) {
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
        dispatch(
          addToCart({ ...existingItem, quantity: existingItem.quantity + 1 })
        );
      } else {
        const newCartItem = { ...product, quantity: 1, checkout: false };
        updatedCart = [...cartItems, newCartItem];
        dispatch(addToCart(newCartItem));
      }

      dispatch(saveUserCart(user.email, updatedCart))
        .then(() => {
          alert(
            `${product.name} has been added to your cart and saved to the database.`
          );
        })
        .catch((error) => {
          console.error("Error saving cart to database:", error.message);
          alert("Failed to save cart to the database. Please try again.");
        });
    },
    [user, cartItems, dispatch]
  );

  // Toggle expanded reviews for a product
  const toggleExpandReviews = useCallback((productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating ? (
        <StarIcon key={index} style={{ color: "#FFD700" }} />
      ) : (
        <StarBorderIcon key={index} style={{ color: "#FFD700" }} />
      )
    ));
  };

  return (
    <div style={{ padding: "0 20px" }}>
      {user?.name === "Admin" && (
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
                  <td>{renderStars(product.rating)}</td>
                  <td>
                    <button onClick={() => toggleExpandReviews(product.id)}>
                      {expandedProductId === product.id
                        ? "Hide Reviews"
                        : "View Reviews"}
                    </button>
                    {expandedProductId === product.id && (
                      <div
                        style={{
                          marginTop: "10px",
                          border: "1px solid #ddd",
                          padding: "10px",
                        }}
                      >
                        {product.reviews?.length > 0 ? (
                          [...product.reviews]
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((review, index) => (
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
                                <strong>{review.name}:</strong>{" "} 
                                {renderStars(review.rating)}
                              </p>
                              <p>{review.comment}</p>
                              <p
                                style={{
                                  fontSize: "0.9em",
                                  color: "#888",
                                }}
                              >
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
});

export default ProductComponent;