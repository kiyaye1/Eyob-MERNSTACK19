let mongooseObj = require("mongoose");

let schemaObj = mongooseObj.Schema;

mongooseObj.connect("mongodb://127.0.0.1/mernstack19");

let productSchema = new schemaObj({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Average rating
    checkout: { type: Boolean, default: false },
    reviews: [
        {
          userId: { type: String, required: true },
          name: String,
          rating: Number, // Individual rating
          comment: String, 
          date: { type: Date, default: Date.now },
        },
      ],
});

let productModel = mongooseObj.model("product", productSchema);

module.exports = productModel;
