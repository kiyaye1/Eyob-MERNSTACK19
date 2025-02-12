const express = require("express");
const recentOrderRouter = express.Router({ strict: true, caseSensitive: true });

const RecentOrderModel = require("../DataModel/RecentOrderDataModel");
const CartDataModel = require("../DataModel/CartDataModel");
const UserDataModel = require("../DataModel/UserDataModel");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

recentOrderRouter.post("/", async (req, res) => {
  const { email, order, total, discount } = req.body;
  console.log(req.body);

  if (!email || !order || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userDoc = await UserDataModel.findOne({ email }); 
    if (!userDoc) {
      return res.status(404).json({ error: `User ${email} not found` });
    }

    const newOrder = new RecentOrderModel({
      userId: email,
      order,
      total,
      discount: discount || 0,
    });

    const savedOrder = await newOrder.save();

    const pdfFileName = `order_${savedOrder._id}.pdf`;
    
    const pdfPath = path.join("D:", "SynergisticIT", pdfFileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text("Order Confirmation", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Order ID: ${savedOrder._id}`);
    doc.text(`User ID: ${savedOrder.userId}`);
    doc.text(`Status: ${savedOrder.status || "Pending"}`);
    doc.text(`Total Amount: $${savedOrder.total}`);
    doc.text(`Discount: $${savedOrder.discount.toFixed(2)}`);
    doc.text(`Payable Amount: $${(savedOrder.total - savedOrder.discount).toFixed(2)}`);
    doc.moveDown();

    doc.text("Items:", { underline: true });
    savedOrder.order.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} | Qty: ${item.quantity} | Unit Price: $${item.price}`
      );
    });

    doc.end();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userDoc.email,
      subject: "Order Confirmation",
      text: `Your order (ID: ${savedOrder._id}) has been placed successfully!`,
      
      attachments: [
          {
            filename: pdfFileName,
            path: pdfPath,
          },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Order created, PDF generated, and email sent successfully.",
      order: savedOrder,
      downloadLink: `/recent-orders/download/${savedOrder._id}`,
    });
  } catch (err) {
    console.error("Error creating order or sending email:", err);
    res.status(500).json({ error: "Failed to save the order or send email." });
  }
});

// GET all orders
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

// PUT to reorder an order
recentOrderRouter.put("/:id/reorder", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await RecentOrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "Delivered" && order.status !== "Cancelled") {
      return res.status(400).json({
        error: "Only delivered or cancelled orders can be reordered",
      });
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
        item.checkout = true; 
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

recentOrderRouter.get("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pdfFileName = `order_${id}.pdf`;
    const pdfPath = path.join("D:", "SynergisticIT", pdfFileName); 

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF not found" });
    }

    res.setHeader("Content-Disposition", `attachment; filename=${pdfFileName}`);
    res.setHeader("Content-Type", "application/pdf");
    res.download(pdfPath, pdfFileName, (err) => {
      if (err) {
        console.error("Error downloading PDF:", err);
        res.status(500).json({ error: "Error downloading PDF" });
      }
    });
  } catch (err) {
    console.error("Error in PDF download route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = recentOrderRouter;
