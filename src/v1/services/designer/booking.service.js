import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";

// Update booking
export const updateBooking = async (clientId, updates, designerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  if (booking.designerId.toString() !== designerId.toString()) {
    throw ApiError.unauthorized(
      "You are not authorized to update this booking."
    );
  }
  Object.assign(booking, updates);
  const updateBook = await booking.save();
  return updateBook;
};

// Get all bookings for a specific designer
export const getAllBooking = async (designerId) => {
  try {
    return await Booking.find({ designerId }).populate("designerId", "email");
  } catch (error) {
    throw ApiError.internalServerError("Error retrieving bookings.");
  }
};

// Get a single booking by ID for a specific designer
export const getBookingById = async (id, designerId) => {
  const booking = await Booking.findOne({ _id: id, designerId }).populate(
    "designerId",
    "email"
  );
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  return booking;
};
