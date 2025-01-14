// Import the mongoose library for interacting with MongoDB
let mongooseObj = require("mongoose");

// Get the Schema object from mongoose for defining schemas
let schemaObj = mongooseObj.Schema;

// Connect to the MongoDB database using the provided URL
mongooseObj.connect("mongodb://127.0.0.1/mernstack19");

// Define the schema for the Product collection
let productSchema = new schemaObj({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
});

// Create a model named "product" based on the defined schema
let productModel = mongooseObj.model("product", productSchema);

// Export the productModel so it can be used in other files
module.exports = productModel;
