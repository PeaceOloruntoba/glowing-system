import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import ApiError from "../../../utils/apiError.js";

// Create a new order
export const createOrder = async (userId, productData) => {
  try {
    let totalPrice = 0;
    const products = [];

    // Iterate over the products and calculate the total price
    for (let productItem of productData) {
      const { productId, quantity } = productItem;
      const product = await Product.findById(productId);

      if (!product) {
        throw ApiError.notFound("Product not found.");
      }

      const price = product.discountPrice; // Assuming the product price is the discountPrice
      totalPrice += price * quantity; // Add the price of the current product to the total price

      products.push({
        productId: product._id,
        quantity,
        price,
      });
    }

    // Create the order
    const order = new Order({
      userId,
      products,
      totalPrice,
    });

    return await order.save();
  } catch (error) {
    throw ApiError.internalServerError("Error creating order.");
  }
};

// Update order status or other details
export const updateOrder = async (orderId, updates) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found.");
  }

  if (
    updates.status &&
    ["paid", "cancelled", "delivered"].includes(updates.status)
  ) {
    order.status = updates.status;
  }

  return await order.save();
};

// Get all orders for a specific user
export const getAllOrders = async (userId) => {
  try {
    return await Order.find({ userId }).populate(
      "products.productId",
      "productName discountPrice"
    ); // Populate product details
  } catch (error) {
    throw ApiError.internalServerError("Error retrieving orders.");
  }
};

// Get a single order by ID for a specific user
export const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId }).populate(
    "products.productId",
    "productName discountPrice"
  );
  if (!order) {
    throw ApiError.notFound("Order not found.");
  }
  return order;
};

// Delete an order
export const deleteOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found.");
  }

  if (order.userId.toString() !== userId.toString()) {
    throw ApiError.unauthorized("You are not authorized to delete this order.");
  }

  return await Order.findByIdAndDelete(orderId);
};
