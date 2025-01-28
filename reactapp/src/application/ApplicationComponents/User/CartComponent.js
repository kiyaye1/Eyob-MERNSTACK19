import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editCartItem, fetchUserCart, saveUserCart, removeFromCartAndSave } from "../../State/Cart/CartActions";
import axios from "axios"; 

const CartComponent = () => {
  const cartItems = useSelector((state) =>
    (state.cartReducer.cartItems || []).filter((item) => !item.checkout)
  );
  const userName = useSelector((state) => state.userReducer.user.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch the user's cart and synchronize state with the database
  const syncCartWithDatabase = async () => {
    if (!userName) return;
    try {
      const response = await axios.get("http://localhost:9000/cart", {
        params: { userId: userName },
      });
      dispatch(fetchUserCart(userName)); // Update the redux store with fetched cart data
    } catch (error) {
      console.error("Error syncing cart with database:", error.message);
    }
  };

  useEffect(() => {
    if (userName) {
      syncCartWithDatabase(); // Fetch the cart data on component load
    }
  }, [userName]);

  const handleRemove = async (id) => {
    if (!userName) {
      alert("You must log in to remove items from the cart in the DB.");
      navigate("/login");
      return;
    }
    try {
      await dispatch(removeFromCartAndSave(id, userName)); // Remove the item
      syncCartWithDatabase(); // Sync with the latest cart from the database
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  const handleEdit = async (id, quantity) => {
    if (quantity > 0) {
      try {
        // Dispatch action to update Redux store
        dispatch(editCartItem(id, quantity));

        // Save updated cart to the database
        const updatedCart = cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );

        await dispatch(saveUserCart(userName, updatedCart));
        console.log("Cart updated successfully in the database.");
        syncCartWithDatabase(); // Fetch the latest cart data
      } catch (error) {
        console.error("Error updating cart in database:", error.message);
        alert("Failed to update cart in the database. Please try again.");
      }
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleCheckout = () => {
    if (!userName) {
      alert("You must log in to proceed to checkout.");
      navigate("/login");
      return;
    }

    const itemsForCheckout = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (itemsForCheckout.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    navigate("/checkout", { state: { selectedItems: itemsForCheckout } });
  };

  const calculateSummary = (items) => {
    const totalAmount = items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 0;
      return sum + price * qty;
    }, 0);

    const totalProductsCount = items.reduce((count, item) => {
      const qty = parseInt(item.quantity, 10) || 0;
      return count + qty;
    }, 0);

    return { totalAmount, totalProductsCount };
  };

  const allItemsSummary = calculateSummary(cartItems);
  const selectedItemsSummary = calculateSummary(
    cartItems.filter((item) => selectedItems.includes(item.id))
  );

  return (
    <div>
      <h2>Cart Component</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <div>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
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
                    ${(
                      (parseFloat(item.price) || 0) * (item.quantity || 0)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleSelectItem(item.id)}
                      style={{
                        backgroundColor: selectedItems.includes(item.id)
                          ? "green"
                          : "gray",
                        color: "white",
                      }}
                    >
                      {selectedItems.includes(item.id)
                        ? "Deselect"
                        : "Select"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3>Cart Summary</h3>
            <div>
              <p>
                <strong>All Items:</strong>
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {allItemsSummary.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Total Products Count:</strong>{" "}
                {allItemsSummary.totalProductsCount}
              </p>
            </div>
            {selectedItems.length > 0 && (
              <div>
                <p>
                  <h3>Selected Items</h3>
                </p>
                <p>
                  <strong>Total Amount:</strong> $
                  {selectedItemsSummary.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Total Products Count:</strong>{" "}
                  {selectedItemsSummary.totalProductsCount}
                </p>
              </div>
            )}
            <div>
              <button onClick={handleCheckout}>Go To Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
