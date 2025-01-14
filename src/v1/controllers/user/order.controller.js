import * as orderService from "../../services/user/order.service.js";

// Create an order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { products } = req.body; // Array of products with quantity

    const newOrder = await orderService.createOrder(userId, products);

    return res
      .status(201)
      .json({ message: "Order created successfully.", data: newOrder });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error creating order." });
  }
};

// Get all orders for a logged-in user
export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await orderService.getAllOrders(userId);

    return res
      .status(200)
      .json({ message: "Orders retrieved successfully.", data: orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Error retrieving orders." });
  }
};

// Get a single order by ID for the logged-in user
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const order = await orderService.getOrderById(orderId, userId);

    return res
      .status(200)
      .json({ message: "Order retrieved successfully.", data: order });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error retrieving order." });
  }
};

// Update order status
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    const updatedOrder = await orderService.updateOrder(orderId, updates);

    return res
      .status(200)
      .json({ message: "Order updated successfully.", data: updatedOrder });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error updating order." });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    await orderService.deleteOrder(orderId, userId);

    return res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error deleting order." });
  }
};
