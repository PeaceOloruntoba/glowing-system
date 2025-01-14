import * as paymentService from "../../services/user/payment.service.js";
import Booking from "../../models/booking.model.js";
import Order from "../../models/order.model.js";

// Initialize payment for a booking or order
export const initializePayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, entityId } = req.body; // type can be "booking" or "order"

    let entity;
    if (type === "booking") {
      entity = await Booking.findById(entityId);
    } else if (type === "order") {
      entity = await Order.findById(entityId);
    } else {
      throw ApiError.badRequest("Invalid payment type.");
    }

    if (!entity)
      throw ApiError.notFound(
        `${type.charAt(0).toUpperCase() + type.slice(1)} not found.`
      );
    if (entity.userId.toString() !== userId.toString())
      throw ApiError.unauthorized(
        "You are not authorized to make this payment."
      );
    if (entity.status.includes("paid"))
      throw ApiError.badRequest(
        `${type.charAt(0).toUpperCase() + type.slice(1)} is already paid for.`
      );

    const amount = entity.totalPrice || entity.productId.discountPrice; // Assume totalPrice or product price

    const payment = await paymentService.initializePayment(
      req.user.email,
      amount,
      {
        [type + "Id"]: entityId, // Set metadata to differentiate between booking and order
      }
    );

    return res.status(200).json({
      message: "Payment initialized successfully.",
      data: payment, // Includes authorization_url for redirection
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Handle payment verification for a booking or order
export const verifyPayment = async (req, res) => {
  try {
    const { reference, type, entityId } = req.body; // reference from Paystack
    const result = await paymentService.handlePayment(
      type,
      entityId,
      reference
    );

    return res.status(200).json({
      message: result.message,
      data: result.entity,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
