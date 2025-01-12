import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";

// Create a new booking
export const createBooking = async (data) => {
  try {
    const booking = new Booking(data);
    return await booking.save();
  } catch (error) {
    throw ApiError.internalServerError("Error creating booking.");
  }
};

// Update booking
export const updateBooking = async (bookingId, updates, userId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  if (booking.userId.toString() !== userId.toString()) {
    throw ApiError.unauthorized(
      "You are not authorized to update this booking."
    );
  }
  Object.assign(booking, updates);
  const updateBook = await booking.save();
  return updateBook;
};

// Get all bookings for a specific user
export const getAllBookings = async (userId) => {
  try {
    return await Booking.find({ userId }).populate("userId", "email");
  } catch (error) {
    throw ApiError.internalServerError("Error retrieving bookings.");
  }
};

// Get a single booking by ID for a specific user
export const getBookingById = async (id, userId) => {
  const booking = await Booking.findOne({ _id: id, userId }).populate(
    "userId",
    "email fullName"
  );
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  return booking;
};

// Delete a booking
export const deleteBooking = async (bookingId, userId) => {
  // Step 1: Check if the booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  if (booking.userId.toString() !== userId.toString()) {
    throw ApiError.unauthorized(
      "You are not authorized to delete this booking."
    );
  }
  const deleteBook = await Booking.findByIdAndDelete(bookingId);
  return deleteBook;
};
