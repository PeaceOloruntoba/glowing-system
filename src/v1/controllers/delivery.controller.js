import FezDeliveryService from "../services/fezDelivery.service.js";
import Order from "../models/order.model.js";
import ApiError from "../../utils/apiError.js";
import catchAsync from "../../utils/catchAsync.js";

export const calculateShippingCost = catchAsync(async (req, res) => {
  const { orderId, pickupAddress, deliveryAddress, packageDetails } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found.");
  }
  if (order.userId.toString() !== req.user.userId) {
    throw ApiError.unauthorized(
      "Unauthorized to calculate shipping for this order."
    );
  }

  const quote = await FezDeliveryService.calculateShippingCost(
    pickupAddress,
    deliveryAddress,
    packageDetails
  );
  order.shippingCost = quote.data.cost;
  order.deliveryAddress = deliveryAddress;
  await order.save();

  res
    .status(200)
    .json({
      success: true,
      message: "Shipping cost calculated.",
      data: quote.data,
    });
});

export const bookDelivery = catchAsync(async (req, res) => {
  const {
    orderId,
    pickupAddress,
    deliveryAddress,
    packageDetails,
    customerDetails,
  } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found.");
  }
  if (order.userId.toString() !== req.user.userId) {
    throw ApiError.unauthorized(
      "Unauthorized to book delivery for this order."
    );
  }
  if (order.status !== "paid") {
    throw ApiError.forbidden("Order must be paid before booking delivery.");
  }

  const delivery = await FezDeliveryService.bookDelivery(
    orderId,
    pickupAddress,
    deliveryAddress,
    packageDetails,
    customerDetails
  );
  order.deliveryId = delivery.data.delivery_id;
  order.status = "packaged";
  await order.save();

  res
    .status(200)
    .json({ success: true, message: "Delivery booked.", data: delivery.data });
});

export const trackDelivery = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found.");
  }
  if (order.userId.toString() !== req.user.userId) {
    throw ApiError.unauthorized("Unauthorized to track this order.");
  }
  if (!order.deliveryId) {
    throw ApiError.badRequest("No delivery booked for this order.");
  }

  const tracking = await FezDeliveryService.trackDelivery(order.deliveryId);
  res
    .status(200)
    .json({
      success: true,
      message: "Delivery tracking retrieved.",
      data: tracking.data,
    });
});
