import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";
import UserProfile from "../../models/userProfile.model.js";
import DesignerProfile from "../../models/designerProfile.model.js";
import emailUtils from "../../../utils/emailUtils.js";
import processPaystackPayment from "../../../utils/paystackPayment.js";
import { createOrderFromBooking } from "./order.service.js";

const validTransitions = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["ongoing", "cancelled"],
  ongoing: ["paid", "cancelled"],
  paid: ["packaged"],
  packaged: ["out for delivery"],
  "out for delivery": ["delivered"],
  delivered: [],
  cancelled: [],
  rejected: [],
};

const validateBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId)
    .populate("productId")
    .populate("designerId");
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.userId.toString() !== userId.toString())
    throw ApiError.unauthorized("Unauthorized to modify this booking.");
  return booking;
};

export const createBooking = async (data) => {
  const { productId, designerId, userId, notes, price } = data;
  const booking = new Booking({
    productId,
    designerId,
    userId,
    price,
    notes,
    status: "pending",
  });
  await booking.save();

  const designerProfile = await DesignerProfile.findOne({ userId: designerId });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "New Booking Request",
      text: `A new booking has been placed for your product. Notes: ${
        notes || "None"
      }. Review and accept it.`,
    });
  }

  return booking;
};

export const cancelBooking = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  if (!validTransitions[booking.status].includes("cancelled")) {
    throw ApiError.forbidden(
      `Cannot cancel a booking in ${booking.status} status.`
    );
  }

  booking.status = "cancelled";
  await booking.save();

  const designerProfile = await DesignerProfile.findOne({
    userId: booking.designerId,
  });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "Booking Cancelled",
      text: `The user has cancelled their booking.`,
    });
  }

  return booking;
};

export const makePayment = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  if (booking.status !== "accepted") {
    throw ApiError.forbidden("Payment can only be made for accepted bookings.");
  }

  const userProfile = await UserProfile.findOne({ userId });
  const paymentResponse = await processPaystackPayment({
    email: userProfile.email,
    reference: bookingId,
    amount: booking.price,
  });

  booking.status = "paid";
  booking.paymentStatus = "completed";
  await booking.save();

  const order = await createOrderFromBooking(bookingId);

  const designerProfile = await DesignerProfile.findOne({
    userId: booking.designerId,
  });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "Payment Received",
      text: `The user has successfully paid for booking ${bookingId}. An order has been created.`,
    });
  }

  return { booking, order, paymentResponse };
};

export const confirmDelivery = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  if (booking.status !== "out for delivery") {
    throw ApiError.forbidden("Booking must be out for delivery first.");
  }

  booking.status = "delivered";
  await booking.save();

  const designerProfile = await DesignerProfile.findOne({
    userId: booking.designerId,
  });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "Booking Delivered",
      text: `The user has confirmed delivery for booking ${bookingId}.`,
    });
  }

  return booking;
};

export const getAllBookings = async (userId) => {
  try {
    const bookings = await Booking.find({ userId }).populate(
      "productId",
      "productName coverImage ourPrice"
    );

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const designerProfile = await DesignerProfile.findOne({
          userId: booking.designerId,
        });
        return {
          ...booking.toObject(),
          businessName: designerProfile?.businessName,
          state: designerProfile?.state,
          businessAddress: designerProfile?.businessAddress,
        };
      })
    );

    return enrichedBookings;
  } catch (error) {
    throw ApiError.internalServerError("Error retrieving bookings.");
  }
};

export const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId })
    .populate("designerId")
    .populate("productId");
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  const designerProfile = await DesignerProfile.findOne({
    userId: booking.designerId,
  });
  return {
    ...booking.toObject(),
    businessName: designerProfile?.businessName,
    state: designerProfile?.state,
    businessAddress: designerProfile?.businessAddress,
  };
};

export const deleteBooking = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  return await Booking.findByIdAndDelete(booking._id);
};
