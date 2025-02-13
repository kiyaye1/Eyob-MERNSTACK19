import React, { useEffect, useState, useCallback, useMemo, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editCartItem, fetchUserCart, saveUserCart, removeFromCartAndSave, } from "../../State/Cart/CartActions";
import { addNotifications } from "../../State/Notification/NotificationActions";
import axiosInstance from "../../axiosConfig";

const CartComponent = React.memo(() => {
  const rawCartItems = useSelector(state => state.cartReducer.cartItems || []);
  const cartItems = useMemo(
    () => rawCartItems.filter(item => !item.checkout),
    [rawCartItems]
  );

  const email = useSelector((state) => state.userReducer.user.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  const syncCartWithDatabase = useCallback(async () => {
    if (!email) return;
    try {
      await axiosInstance.get("/cart", {
        params: { userId: email },
      });
      dispatch(fetchUserCart(email));
    } catch (error) {
      console.error("Error syncing cart with database:", error.message);
    }
  }, [email, dispatch]);

  useEffect(() => {
    if (email) {
      syncCartWithDatabase();
    }
  }, [email, syncCartWithDatabase]);

  const handleRemove = useCallback(
    async (id) => {
      if (!email) {
        alert("You must log in to remove items from the cart in the DB.");
        navigate("/login");
        return;
      }
      try {
        await dispatch(removeFromCartAndSave(id, email));
        syncCartWithDatabase();
      } catch (error) {
        console.error("Error removing item:", error.message);
      }
    },
    [email, navigate, dispatch, syncCartWithDatabase]
  );

  const handleEdit = useCallback(
    async (id, quantity) => {
      if (quantity > 0) {
        try {
          dispatch(editCartItem(id, quantity));
          const updatedCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          await dispatch(saveUserCart(email, updatedCart));
          console.log("Cart updated successfully in the database.");
          syncCartWithDatabase();
        } catch (error) {
          console.error("Error updating cart in database:", error.message);
          alert("Failed to update cart in the database. Please try again.");
        }
      }
    },
    [email, cartItems, dispatch, syncCartWithDatabase]
  );

  // Toggle item selection
  const toggleSelectItem = useCallback((id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  }, []);

  // Checkout handler
  const handleCheckout = useCallback(() => {
    if (!email) {
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
    dispatch(
      addNotifications({
        id: new Date().getTime(),
        message: "Apply a discount coupon to save money!",
        static: false,
      })
    );
    navigate("/checkout", { state: { selectedItems: itemsForCheckout } });
  }, [email, cartItems, selectedItems, dispatch, navigate]);

  const calculateSummary = useCallback((items) => {
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
  }, []);

  const allItemsSummary = useMemo(
    () => calculateSummary(cartItems),
    [cartItems, calculateSummary]
  );

  const selectedItemsSummary = useMemo(() => {
    const filtered = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    return calculateSummary(filtered);
  }, [cartItems, selectedItems, calculateSummary]);

  return (
      <div style={{ padding: "20px" }}>
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
                    <td>{item.rating.toFixed(2)}</td>
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
                      $
                      {(
                        (parseFloat(item.price) || 0) *
                        (item.quantity || 0)
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
                      <button onClick={() => handleRemove(item.id)}>
                        Remove
                      </button>
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
              <div>
                <button onClick={handleCheckout}>Go To Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>

  );
});

export default CartComponent;