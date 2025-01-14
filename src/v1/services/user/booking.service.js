import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";

// Helper function to validate and fetch booking
const validateBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId).populate("productId");
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.userId.toString() !== userId.toString())
    throw ApiError.unauthorized("Unauthorized to modify this booking.");
  return booking;
};

// Create a new booking
export const createBooking = async (data) => {
  const booking = new Booking(data);
  return await booking.save();
};

// Update an existing booking
export const updateBooking = async (bookingId, updates, userId) => {
  const booking = await validateBooking(bookingId, userId);

  const restrictedStatuses = ["paid", "cancelled", "delivered"];
  if (updates.status && restrictedStatuses.includes(updates.status)) {
    throw ApiError.forbidden(`Cannot set status to '${updates.status}'.`);
  }

  Object.assign(booking, updates);
  return await booking.save();
};

// Fetch all bookings for a user
export const getAllBookings = async (userId) => {
  return await Booking.find({ userId })
    .populate("userId", "email fullName")
    .populate("productId", "productName discountPrice");
};

// Fetch a single booking by ID
export const getBookingById = async (bookingId, userId) => {
  return await validateBooking(bookingId, userId);
};

// Delete a booking
export const deleteBooking = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  return await Booking.findByIdAndDelete(booking._id);
};
