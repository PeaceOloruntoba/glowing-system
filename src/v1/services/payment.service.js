import axios from "axios";
import ApiError from "../../../utils/apiError.js";
import Booking from "../../models/booking.model.js";
import Order from "../../models/order.model.js";

// Function to initialize payment
export const initializePayment = async (email, amount, metadata) => {
  try {
    const url = "https://api.paystack.co/transaction/initialize";
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
    const payload = {
      email,
      amount: amount * 100, // Convert amount to kobo
      metadata, // Accept metadata to identify the transaction (bookingId or orderId)
    };
    const response = await axios.post(url, payload, { headers });
    return response.data; // Contains the authorization_url and other details
  } catch (error) {
    throw ApiError.internalServerError("Error initializing payment.");
  }
};

// Function to verify payment with Paystack
export const verifyPayment = async (reference) => {
  try {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    };
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw ApiError.internalServerError("Error verifying payment.");
  }
};

// Common payment handler function that can be used for both bookings and orders
export const handlePayment = async (type, entityId, reference) => {
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
  if (entity.status.includes("paid"))
    throw ApiError.badRequest(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } has already been paid for.`
    );
  const verificationResult = await verifyPayment(reference);
  if (
    verificationResult.status &&
    verificationResult.data.status === "success"
  ) {
    entity.status = "paid";
    await entity.save();
    return {
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } payment successful and status updated.`,
      entity,
    };
  } else {
    throw ApiError.badRequest("Payment verification failed.");
  }
};
