// Import the Express library for creating HTTP routes
let express = require("express");

// Create a router object to define routes
let router = express.Router({});

// Import the CartDataModel for interacting with the Cart collection in MongoDB
let CartDataModel = require("../DataModel/CartDataModel");

// POST Route to save or update the user's cart
router.post("/saveUserCart", (req, res) => {
  // Check if a cart already exists for the given user ID
  CartDataModel.findOne({ userid: req.body.userid })
    .then((cartDbObj) => {
      if (!cartDbObj) {
        // If no cart exists, create a new cart object and save it to the database
        let cartObj = new CartDataModel(req.body);
        cartObj
          .save()
          .then((data) => {
            // Respond with the saved cart data
            return res.json(data);
          })
          .catch((err) => {
            // Handle errors during the save operation
            return res.status(500).send("Error Occurred: " + err);
          });
      } else {
        // If a cart already exists, update it with the new data
        cartDbObj.cart = req.body.cart;
        cartDbObj
          .save()
          .then((data) => {
            // Respond with the updated cart data
            return res.json(data);
          })
          .catch((err) => {
            return res.status(500).send("Error Occurred: " + err);
          });
      }
    })
    .catch((err) => {
      console.error("Error while fetching cart:", err);
      res.status(500).send("Error while fetching cart!");
    });
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
      console.error("Error while fetching user cart:", err);
      res.status(500).send("Error Occurred: " + err);
    });
});

// Export the router to make it accessible in other files
module.exports = router;
