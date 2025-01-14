import * as bookingService from "../../services/designer/booking.service.js";

// Update an existing booking
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const designerId = req.user.userId;
    const updates = req.body;

    const updatedBooking = await bookingService.updateBooking(
      bookingId,
      updates,
      designerId
    );

    return res.status(200).json({
      message: "Booking updated successfully.",
      data: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error updating booking." });
  }
};

// Get all bookings for the logged-in designer
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await bookingService.getAllBookings(userId);

    return res.status(200).json({
      message: "Bookings retrieved successfully.",
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving bookings." });
  }
};

// Get a single booking by ID for the logged-in designer
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const designerId = req.user.userId;

    const booking = await bookingService.getBookingById(bookingId, designerId);

    return res.status(200).json({
      message: "Booking retrieved successfully.",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error retrieving booking." });
  }
};
