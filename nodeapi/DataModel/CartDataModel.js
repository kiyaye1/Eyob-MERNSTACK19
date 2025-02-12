let mongooseObj = require("mongoose"); // Import the mongoose library for interacting with MongoDB

let schemaObj = mongooseObj.Schema; // Get the Schema object from mongoose for defining schemas

mongooseObj.connect("mongodb://127.0.0.1/mernstack19"); // Connect to the MongoDB database using the provided URL

let CartSchema = new schemaObj( // Define the schema for the Cart collection
  {
    userid: { type: String, required: true },
    cart: [ // An array of cart items --- any type (Mixed)
      {
        type: schemaObj.Types.Mixed,
      },
    ],
  },
  {
    versionKey: false,
  }
);

let CartModel = mongooseObj.model("cart", CartSchema); // Create a model named "cart" based on the defined schema

module.exports = CartModel; // Export the CartModel so it can be used in other files
