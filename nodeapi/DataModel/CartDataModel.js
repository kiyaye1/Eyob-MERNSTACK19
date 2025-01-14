// Import the mongoose library for interacting with MongoDB
let mongooseObj = require("mongoose");

// Get the Schema object from mongoose for defining schemas
let schemaObj = mongooseObj.Schema;

// Connect to the MongoDB database using the provided URL
mongooseObj.connect("mongodb://127.0.0.1/mernstack19");

// Define the schema for the Cart collection
let CartSchema = new schemaObj(
  {
    userid: { type: String, required: true },
    
    // An array of cart items --- any type (Mixed)
    cart: [
      {
        type: schemaObj.Types.Mixed,
      },
    ],
  },
  {
    versionKey: false,
  }
);

// Create a model named "cart" based on the defined schema
let CartModel = mongooseObj.model("cart", CartSchema);

// Export the CartModel so it can be used in other files
module.exports = CartModel;
