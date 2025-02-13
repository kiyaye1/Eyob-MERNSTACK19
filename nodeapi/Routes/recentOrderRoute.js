const express = require("express");
const recentOrderRouter = express.Router({ strict: true, caseSensitive: true });

const RecentOrderModel = require("../DataModel/RecentOrderDataModel");
const CartDataModel = require("../DataModel/CartDataModel");
const UserDataModel = require("../DataModel/UserDataModel");

const AWS = require("aws-sdk");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
});

const s3 = new AWS.S3();

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
    
    // Generate PDF in memory
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Upload PDF to S3
      const params = {
        Bucket: "syn-cart-order-pdfs", 
        Key: pdfFileName,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      };

      const s3Upload = await s3.upload(params).promise();
      console.log("Uploaded to S3:", s3Upload.Location);

      // Send email with S3 link
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userDoc.email,
        subject: "Order Confirmation",
        text: `Your order (ID: ${savedOrder._id}) has been placed successfully! Download PDF: ${s3Upload.Location}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        success: true,
        message: "Order created, PDF uploaded to S3, and email sent successfully.",
        order: savedOrder,
        downloadLink: s3Upload.Location,
      });
    });

    // Generate PDF content
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
      doc.text(`${index + 1}. ${item.name} | Qty: ${item.quantity} | Unit Price: $${item.price}`);
    });

    doc.end();
  } catch (err) {
    console.error("Error creating order or uploading PDF:", err);
    res.status(500).json({ error: "Failed to save the order or upload PDF." });
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

module.exports = recentOrderRouter;
