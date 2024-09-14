const mongoose = require("mongoose");

const OrderItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

exports.OrderItem = mongoose.model("OrderItem", OrderItemSchema, "order_item");
