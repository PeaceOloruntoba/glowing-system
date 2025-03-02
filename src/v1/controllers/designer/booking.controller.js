import * as bookingService from "../../services/designer/booking.service.js";
import catchAsync from "../../../utils/catchAsync.js";

// ✅ Accept booking
export const acceptBooking = catchAsync(async (req, res) => {
  await bookingService.acceptBooking(req.params.id, req.user.userId);
  res.json({ success: true, message: "Booking accepted." });
});

// ✅ Decline booking
export const declineBooking = catchAsync(async (req, res) => {
  await bookingService.declineBooking(req.params.id, req.user.userId);
  res.json({ success: true, message: "Booking declined." });
});

// ✅ Mark as out for delivery
export const markAsOutForDelivery = catchAsync(async (req, res) => {
  await bookingService.markAsOutForDelivery(req.params.id, req.user.userId);
  res.json({ success: true, message: "Booking marked as out for delivery." });
});

// Get all bookings for the logged-in designer
export const getAllBookings = async (req, res) => {
  try {
    const designerId = req.user.userId;
    const bookings = await bookingService.getAllBookings(designerId);

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
