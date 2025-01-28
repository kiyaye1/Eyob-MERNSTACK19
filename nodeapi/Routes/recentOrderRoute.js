const express = require("express");
const recentOrderRouter = express.Router({ strict: true, caseSensitive: true });
const RecentOrderModel = require("../DataModel/RecentOrderDataModel");
const CartDataModel = require("../DataModel/CartDataModel");

// POST to save a new order
recentOrderRouter.post("/", async (req, res) => {
  const { userId, order, total, discount } = req.body;

  if (!userId || !order || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newOrder = new RecentOrderModel({
      userId,
      order,
      total,
      discount: discount || 0,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to save the order" });
  }
});

// Get all orders
recentOrderRouter.get("/", async (req, res) => {
  try {
    const orders = await RecentOrderModel.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// PUT to cancel an order
recentOrderRouter.put("/:id/cancel", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await RecentOrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ error: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    const productIds = order.order.map((item) => item.id);
    await CartDataModel.updateOne(
      { userid: order.userId },
      { $set: { "cart.$[elem].checkout": false } },
      { arrayFilters: [{ "elem.id": { $in: productIds } }] }
    );

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// PUT to update order status
recentOrderRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedOrder = await RecentOrderModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to update the order" });
  }
});

// PUT TO reorder an order
recentOrderRouter.put("/:id/reorder", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await RecentOrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "Delivered" && order.status !== "Cancelled") {
      return res.status(400).json({ error: "Only cancelled orders can be reordered" });
    }

    // Extract product IDs from the order
    const productIds = order.order.map((item) => item.id);

    // Retrieve the user's cart
    const userCart = await CartDataModel.findOne({ userid: order.userId });

    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Update the checkout status for matching cart items
    userCart.cart.forEach((item) => {
      if (productIds.includes(item.id)) {
        item.checkout = true; // Set checkout flag to true for matching items
      }
    });

    // Save the updated cart
    const updatedCart = await userCart.save();

    console.log("Updated cart:", updatedCart);

    // Update the order's status and dateTime
    order.status = "Pending";
    order.dateTime = new Date().toISOString();
    await order.save();

    res.status(200).json({ message: "Reorder successful and cart updated", order });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT to deliver an order
recentOrderRouter.put("/:id/deliver", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await RecentOrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status to "Delivered"
    order.status = "Delivered";
    await order.save();

    // Remove items from the cart
    const productIds = order.order.map((item) => item.id);

    await CartDataModel.updateOne(
      { userid: order.userId },
      { $pull: { cart: { id: { $in: productIds } } } }
    );

    res.status(200).json({ message: "Order delivered successfully", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to deliver order" });
  }
});

module.exports = recentOrderRouter;
