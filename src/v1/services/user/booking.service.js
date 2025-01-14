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
// export const updateBooking = async (bookingId, updates, userId) => {
//   const booking = await Booking.findById(bookingId);
//   if (!booking) {
//     throw ApiError.notFound("Booking not found.");
//   }
//   if (booking.userId.toString() !== userId.toString()) {
//     throw ApiError.unauthorized(
//       "You are not authorized to update this booking."
//     );
//   }
//   Object.assign(booking, updates);
//   const updateBook = await booking.save();
//   return updateBook;
// };

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
  const restrictedStatuses = ["paid", "cancelled", "delivered"];
  if (updates.status && restrictedStatuses.includes(updates.status)) {
    throw ApiError.forbidden(
      `You are not allowed to set status to '${updates.status}'.`
    );
  }
  booking.status = updates.status || booking.status;

  return await booking.save();
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
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }

  if (booking.userId.toString() !== userId.toString()) {
    throw ApiError.unauthorized(
      "You are not authorized to delete this booking."
    );
  }
  return await Booking.findByIdAndDelete(bookingId);
};
