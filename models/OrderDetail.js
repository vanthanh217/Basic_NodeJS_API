const mongoose = require("mongoose");

const orderDetail = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    get: function () {
      return this.quantity * this.price;
    },
  },
});

exports.OrderDetail = mongoose.model(
  "OrderDetail",
  orderDetail,
  "orderdetails"
);
