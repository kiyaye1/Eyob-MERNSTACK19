let express = require("express"); // Import the Express library for creating HTTP routes

let router = express.Router({}); // Create a router object to define routes

let CartDataModel = require("../DataModel/CartDataModel"); // Import the CartDataModel for interacting with the Cart collection in MongoDB


// GET Route to fetch the user's cart
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send("User ID is required.");
  }

  try {
    const cartDbObj = await CartDataModel.findOne({ userid: userId });

    if (cartDbObj) {
      return res.json(cartDbObj);
    } else {
      return res.json({ cart: [] }); // Return an empty cart if none exists
    }
  } catch (err) {
    res.status(500).send("Internal server error.");
  }
});

// POST Route to save or update the user's cart
router.post("/saveUserCart", (req, res) => {
  const { userid, cart } = req.body;

  // Validate the payload
  if (!userid || !Array.isArray(cart)) {
    return res.status(400).send("Invalid data.");
  }

  CartDataModel.findOne({ userid })
    .then((cartDbObj) => {
      if (!cartDbObj) {
        // Create a new cart document if it doesn't exist
        let cartObj = new CartDataModel({ userid, cart });
        cartObj
          .save()
          .then((data) => res.json(data))
          .catch((err) => res.status(500).send("Error saving cart: " + err));
      } else {
        // Update the existing cart
        cartDbObj.cart = cart; // Replace the cart items
        cartDbObj
          .save()
          .then((data) => res.json(data))
          .catch((err) => res.status(500).send("Error updating cart: " + err));
      }
    })
    .catch((err) => res.status(500).send("Error finding cart: " + err));
});

// POST Route to fetch the user's cart data
router.post("/getUserCart", (req, res) => {
  // Find the cart for the given user ID
  CartDataModel.findOne({ userid: req.body.userid })
    .then((cartDbObj) => {
      if (cartDbObj) {
        // If a cart exists, respond with the cart data
        return res.json(cartDbObj);
      } else {
        // If no cart exists, respond with an empty cart
        return res.json({ cart: [] });
      }
    })
    .catch((err) => {
      res.status(500).send("Error Occurred: " + err);
    });
});

// POST Route to control the checkout status of the cart item
router.post("/mark-checkedout", async (req, res) => {
  const { userId, itemIds } = req.body;

  try {
    const result = await CartDataModel.updateOne(
      { userid: userId },
      { $set: { "cart.$[elem].checkout": true } },
      { arrayFilters: [{ "elem.id": { $in: itemIds } }] } // Ensure the filter matches the item IDs
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ success: true, message: "Items marked as checked out successfully." });
    } else {
      res.status(400).json({ success: false, message: "No matching items found to update." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update items." });
  }
});

// POST Route to update checkout
router.put("/update-checkout", async (req, res) => {
  const { userId, productIds, checkout } = req.body;

  if (!userId || !productIds || productIds.length === 0) {
    return res.status(400).send("Invalid request data");
  }

  try {
    const userCart = await CartDataModel.findOne({ userid: userId });

    if (userCart) {
      // Update the checkout flag for matching items
      userCart.cart = userCart.cart.map((item) =>
        productIds.includes(item.id) ? { ...item, checkout } : item
      );

      await userCart.save();
      return res.status(200).send("Cart updated successfully");
    }

    res.status(404).send("Cart not found");
  } catch (error) {
    res.status(500).send("Failed to update cart");
  }
});

// PUT Route to reorder cancelled order
router.put("/reorder", async (req, res) => {
  const { userId, productIds } = req.body;

  if (!userId || !productIds || productIds.length === 0) {
    return res.status(400).send("Invalid request data");
  }

  try {
    const userCart = await CartDataModel.findOne({ userid: userId });

    if (userCart) {
      userCart.cart = userCart.cart.map((item) =>
        productIds.includes(item.id) ? { ...item, checkout: true } : item
      );

      await userCart.save();
      return res.status(200).send("Cart updated successfully for reorder");
    }

    res.status(404).send("Cart not found");
  } catch (error) {
    res.status(500).send("Failed to update cart for reorder");
  }
});

// PUT Route to remove items from the cart
router.put("/remove-items", async (req, res) => {
  const { userId, productIds } = req.body;

  if (!userId || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).send("Invalid request data");
  }

  try {
    const userCart = await CartDataModel.findOne({ userid: userId });

    if (userCart) {
      // Remove items from the cart
      userCart.cart = userCart.cart.filter((item) => !productIds.includes(item.id));
      await userCart.save();

      return res.status(200).send("Items removed from cart successfully");
    }

    res.status(404).send("Cart not found");
  } catch (error) {
    res.status(500).send("Failed to remove items from cart");
  }
});

module.exports = router;
