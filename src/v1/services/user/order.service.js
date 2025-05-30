import Order from "../../models/order.model.js";
import Booking from "../../models/booking.model.js";
import Product from "../../models/product.model.js";
import ApiError from "../../../utils/apiError.js";
import processPaystackPayment from "../../../utils/paystackPayment.js";
import UserProfile from "../../models/userProfile.model.js";
import emailUtils from "../../../utils/emailUtils.js";

export const createOrderFromBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId).populate("productId");
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  if (booking.status !== "paid") {
    throw ApiError.forbidden("Booking must be paid to create an order.");
  }

  const order = new Order({
    userId: booking.userId,
    products: [
      {
        productId: booking.productId._id,
        quantity: 1,
        price: booking.price,
      },
    ],
    totalPrice: booking.price,
    status: "paid",
  });

  await order.save();
  return order;
};

export const createOrder = async (userId, productData) => {
  let totalPrice = 0;
  const products = [];
  for (let productItem of productData) {
    const { productId, quantity } = productItem;
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found.");
    }
    const price = product.discountPrice;
    totalPrice += price * quantity;
    products.push({
      productId: product._id,
      quantity,
      price,
    });
  }
  const order = new Order({
    userId,
    products,
    totalPrice,
  });
  return await order.save();
};

export const initiateOrderPayment = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found.");
  }
  if (order.userId.toString() !== userId.toString()) {
    throw ApiError.unauthorized("Unauthorized to pay for this order.");
  }
  if (order.status === "paid") {
    throw ApiError.badRequest("Order is already paid.");
  }

  const userProfile = await UserProfile.findOne({ userId });
  const paymentResponse = await processPaystackPayment({
    email: userProfile.email,
    reference: orderId,
    amount: order.totalPrice,
  });

  order.status = "paid";
  await order.save();

  return { order, paymentResponse };
};

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

export const getAllOrders = async (userId) => {
  return await Order.find({ userId }).populate(
    "products.productId",
    "productName discountPrice"
  );
};

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
