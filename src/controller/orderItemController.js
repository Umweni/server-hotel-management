
import Order from "../models/OrderItem.js";
import Menu from "../models/Menu.js";



// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, customer, createdBy, booking, roomNumber } = req.body;

    // Auto-generate purchaseId
    const purchaseId = "ORD-" + Date.now();

    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).send({ status: "error", msg: "Menu item not found" });
      }
      totalPrice += menuItem.price * item.quantity;
    }

    const order = new Order({
      purchaseId,
      items,
      customer,
      totalPrice,
      createdBy,
      booking,
      roomNumber,
    });

    await order.save();

    res.status(201).send({
      status: "success",
      msg: "Order created successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).send({ status: "error", msg: err.message });
  }
};


// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem")
      .populate("customer")
      .populate("createdBy")
      .populate("booking");
    res.status(200).send({ status: "success", data: orders });
  } catch (err) {
    res.status(500).send({ status: "error", msg: err.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.menuItem")
      .populate("customer")
      .populate("createdBy")
      .populate("booking");

    if (!order) {
      return res.status(404).send({ status: "error", msg: "Order not found" });
    }
    res.status(200).send({ status: "success", data: order });
  } catch (err) {
    res.status(500).send({ status: "error", msg: err.message });
  }
};

// Update an order by ID
export const updateOrder = async (req, res) => {
  try {
    const { items, customer, booking, roomNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ status: "error", msg: "Order not found" });
    }

    // Update fields
    order.items = items;
    order.customer = customer;
    order.booking = booking;
    order.roomNumber = roomNumber;

    // Validate items and recalculate total price
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).send({ status: "error", msg: "Menu item not found" });
      }
      totalPrice += menuItem.price * item.quantity;
    }
    order.totalPrice = totalPrice;

    await order.save();

    res.status(200).send({ status: "success", data: order, totalPrice: order.totalPrice });
  } catch (err) {
    res.status(500).send({ status: "error", msg: err.message });
  }
};

// Update only the status of an order
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).send({ status: "error", msg: "Order not found" });
    }
    res.status(200).send({ status: "success", data: order });
  } catch (err) {
    res.status(500).send({ status: "error", msg: err.message });
  }
};

// Delete an order by ID
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send({ status: "error", msg: "Order not found" });
    }
    res.status(200).send({ status: "success", msg: "Order deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: "error", msg: err.message });
  }
};
