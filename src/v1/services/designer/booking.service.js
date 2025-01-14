import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";

// Update booking
export const updateBooking = async (bookingId, updates, designerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  if (booking.designerId.toString() !== designerId.toString()) {
    throw ApiError.unauthorized(
      "You are not authorized to update this booking."
    );
  }
  const restrictedStatuses = ["paid", "cancelled", "delivered"];
  if (updates.status && restrictedStatuses.includes(updates.status)) {
    throw ApiError.forbidden(
      `You are not allowed to set status to '${updates.status}'.`
    );
  }
  booking.status = updates.status || booking.status;

  return await booking.save();
};

// Get all bookings for a specific designer
export const getAllBookings = async (userId) => {
  try {
    return await Booking.find({userId});
  } catch (error) {
    throw ApiError.internalServerError("Error retrieving bookings.");
  }
};

// Get a single booking by ID for a specific designer
export const getBookingById = async (id, designerId) => {
  const booking = await Booking.findOne({ _id: id, designerId }).populate(
    "userId",
    "email fullName"
  );
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  return booking;
};
