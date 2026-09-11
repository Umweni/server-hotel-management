import Order from "../models/Order.js";
import Menu from "../models/Menu.js";

export const createOrder = async (req, res) => {
  try {
    const { guestId, menuId, quantity } = req.body;

    // Find the menu item to get its price
    const menuItem = await Menu.findById(menuId);
    if (!menuItem) {
      return res.status(404).send({ status: 'error', msg: 'Menu item not found' });
    }

    // Calculate totalPrice automatically
    const totalPrice = menuItem.price * quantity;

    const order = new Order({
      guestId,
      menuId,
      quantity,
      totalPrice 
    });

    await order.save();
    return res.status(201).send({ status: 'ok', msg: 'successfully created', order });
  } catch (error) {
    return res.status(400).send({ status: 'error', msg: error.message });
  }
};



// Get all orders (with populated guest & menu)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("guestId", "name email")
            .populate("menuId", "title price");
        res.json(orders);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("guestId", "name email")
            .populate("menuId", "title price");

        if (!order) return res.status(404).send({ message: "Order not found" });
        res.send(order);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) return res.status(404).send({ message: "Order not found" });
        res.send(order);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).send({ message: "Order not found" });
        return res.send({ message: "Order deleted successfully" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
