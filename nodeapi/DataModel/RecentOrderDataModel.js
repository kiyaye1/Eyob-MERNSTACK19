let mongooseObj = require("mongoose");

let schemaObj = mongooseObj.Schema;

mongooseObj.connect("mongodb://127.0.0.1/mernstack19");

let RecentOrderSchema = new schemaObj({
    userId: { type: String, required: true },
    order: { type: Array, required: true },
    dateTime: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }, 
    total: { type: Number, required: true },
    discount: {type: Number, default: 0, required: true }
});

let RecentOrderModel = mongooseObj.model("recentOrder", RecentOrderSchema);

module.exports = RecentOrderModel;
