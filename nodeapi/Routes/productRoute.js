// Import the Express library for creating HTTP routes
const express = require("express");

// Create a router with strict routing and case sensitivity enabled
const productRouter = express.Router({ strict: true, caseSensitive: true });

// Import the ProductDataModel for interacting with the Product collection in MongoDB
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
    // Retrieve all products from the database
    const products = await productDataModel.find();

    // Respond with the product list, formatted with selected fields
    res.json(
      products.map((product) => ({
        id: product._id, 
        name: product.name, 
        price: product.price, 
        description: product.description, 
        rating: product.rating, 
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// Export the product router to make it accessible in other files
module.exports = productRouter;
