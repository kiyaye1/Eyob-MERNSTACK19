const express = require("express");

const productRouter = express.Router({ strict: true, caseSensitive: true });

const productDataModel = require("../DataModel/ProductDataModel");

// POST Route to create a new product
productRouter.post("/createProducts", (req, res) => {
  // Extract the product data from the request body
  let productObj = req.body;

  // Create a new instance of the product model with the provided data
  let productSchemaObj = new productDataModel(productObj);

  // Save the new product to the database
  productSchemaObj
    .save()
    .then((newProduct) => {
      console.log("New product saved:", newProduct);
      res.status(201).send(newProduct);
    })
    .catch((error) => {
      console.error("Error saving product:", error.message);
      res.status(400).json({
        message: "Failed to create product",
        error: error.message,
      });
    });
});

// GET to fetch all products
productRouter.get("/fetchProducts", async (req, res) => {
  try {
    const products = await productDataModel.find(); // Retrieve all products

    // Respond with products
    res.json(
      products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        rating: product.rating,
        reviews: product.reviews, 
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// POST to add reviews
productRouter.post("/add-review/:productId", async (req, res) => {
  const { productId } = req.params;
  const { userId, name, rating, comment } = req.body;

  // Validate required fields
  if (!userId || !name || typeof rating !== "number" || !comment.trim()) {
    return res.status(400).json({ message: "Rating, comment, userId, and name are required." });
  }

  try {
    const product = await productDataModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Add the review
    product.reviews.push({
      userId,
      name,
      rating,
      comment,
      date: new Date(),
    });

    // Update the average rating
    product.rating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

    await product.save();

    res.status(200).json({ message: "Review added successfully.", product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = productRouter;
