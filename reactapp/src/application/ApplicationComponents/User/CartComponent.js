import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  editCartItem,
  fetchUserCart,
  saveUserCart,
  removeFromCartAndSave,
} from "../../State/Cart/CartActions";

const CartComponent = () => {
  // Select cart items and userName from the Redux state
  const cartItems = useSelector((state) => state.cartReducer.cartItems || []);
  const userName = useSelector((state) => state.userReducer.user.userName);

  // Initialize dispatch to trigger Redux actions
  const dispatch = useDispatch();

  // Hook for navigation between routes
  const navigate = useNavigate();

  // Fetch user cart from the database if the user is logged in and the cart is empty
  useEffect(() => {
    if (userName && cartItems.length === 0) {
      dispatch(fetchUserCart(userName));
    }
  }, [userName, cartItems, dispatch]);

  // Handle removing an item from the cart
  const handleRemove = (id) => {
    if (!userName) {
      // Redirect to login if the user is not logged in
      alert("You must log in to remove items from the cart in the DB.");
      navigate("/login");
      return;
    }
    dispatch(removeFromCartAndSave(id, userName));
  };

  // Handle editing the quantity of a cart item
  const handleEdit = (id, quantity) => {
    if (quantity > 0) {
      dispatch(editCartItem(id, quantity));
    }
  };

  // Handle saving the cart to the database
  const handleSaveCart = async () => {
    if (!userName) {
      // Redirect to login if the user is not logged in
      alert("You must log in to save the cart.");
      navigate("/login");
    } else {
      try {
        // Dispatch action to save the cart
        await dispatch(saveUserCart(userName, cartItems));
        alert("Cart saved to DB successfully!");
      } catch (error) {
        console.error("Error saving cart:", error.message);
        alert("Failed to save cart. Please try again.");
      }
    }
  };

  // Calculate the total cart amount
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity, 10) || 0;
    return sum + price * qty;
  }, 0);

  // Calculate the total count of products in the cart
  const totalProductsCount = cartItems.reduce((count, item) => {
    const qty = parseInt(item.quantity, 10) || 0;
    return count + qty;
  }, 0);

  return (
    <div>
      <h2>Cart Component</h2>
      {cartItems.length === 0 ? (
        // Show a message if the cart is empty
        <p>No items in the cart.</p>
      ) : (
        <div>
          {/* Display cart items in a table */}
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td>{item.description}</td>
                  <td>{item.rating}</td>
                  <td>
                    {/* Input field to update the quantity */}
                    <input
                      type="number"
                      value={item.quantity || 1}
                      min="1"
                      onChange={(e) =>
                        handleEdit(item.id, parseInt(e.target.value, 10) || 1)
                      }
                    />
                  </td>
                  <td>
                    {(
                      (parseFloat(item.price) || 0) * (item.quantity || 0)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display cart summary */}
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3>Cart Summary</h3>
            <p>
              <strong>Amount:</strong> ${totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Products Count:</strong> {totalProductsCount}
            </p>
            <div>
              {/* Button to save the cart */}
              <button onClick={handleSaveCart} style={{ marginRight: "10px" }}>
                Save Cart
              </button>
              <button onClick={() => navigate("/checkout")}>
                Go To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
