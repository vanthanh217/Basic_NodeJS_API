const { Order } = require("../models/Order");
const { OrderItem } = require("../models/OrderItem");

const getListOrder = async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate("user", "fullName")
      .sort("dateOrdered"); // --> A-Z
    //   .sort({"dateOrdered" : -1}); // --> Z-A
    res.json(orderList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullName")
      .populate({ path: "orderItems", populate: "productId" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleCreateOrder = async (req, res) => {
  try {
    const orderItemIds = Promise.all(
      req.body.orderItems.map(async (item) => {
        const newOrderItem = new OrderItem({
          quantity: item.quantity,
          productId: item.productId,
        });

        await newOrderItem.save();

        return newOrderItem._id;
      })
    );
    const orderItemsResolved = await orderItemIds;
    const totalPrices = await Promise.all(
      orderItemsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "productId",
          "price"
        );
        const totalPrice = orderItem.productId.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    const order = new Order({
      orderItems: orderItemsResolved,
      user: req.body.user,
      phone: req.body.phone,
      address: req.body.address,
      status: req.body.status,
      totalAmount: totalPrice,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ message: "The order can't be created!" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (order) {
      for (const orderItem of order.orderItems) {
        await OrderItem.findByIdAndDelete(orderItem);
      }
      return res.status(200).json({ message: "Remove order successfully!" });
    } else {
      return res.status(404).json({ message: "Order not found!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userOrderList = await Order.find({ user: req.params.user_id })
      .populate({ path: "orderItems", populate: "productId" })
      .sort("dateOrdered");
    res.json(userOrderList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListOrder,
  getOrder,
  handleCreateOrder,
  updateStatus,
  removeOrder,
  getUserOrders,
};
