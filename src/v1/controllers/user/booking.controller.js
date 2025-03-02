import * as bookingService from "../../services/user/booking.service.js";
import catchAsync from "../../../utils/catchAsync.js";
import productService from "../../services/general/product.service.js";

// ✅ Create a new booking
export const createBooking = catchAsync(async (req, res) => {
  const productId = req.body.productId;
  const product = await productService.getProductById(productId);
  console.log(product);
  const booking = await bookingService.createBooking({
    ...req.body,
    price: product.ourPrice,
    designerId: product.designerId,
    userId: req.user.userId,
  });
  res
    .status(201)
    .json({ success: true, message: "Booking created successfully.", booking });
});

// ✅ Cancel booking (only before payment)
export const cancelBooking = catchAsync(async (req, res) => {
  await bookingService.cancelBooking(req.params.id, req.user.userId);
  res.json({ success: true, message: "Booking cancelled successfully." });
});

// ✅ Make payment using Paystack
export const makePayment = catchAsync(async (req, res) => {
  const paymentData = await bookingService.makePayment(
    req.params.id,
    req.user.userId
  );
  res.json({ success: true, message: "Payment initiated.", paymentData });
});

// ✅ Confirm delivery (final step)
export const confirmDelivery = catchAsync(async (req, res) => {
  await bookingService.confirmDelivery(req.params.id, req.user.userId);
  res.json({ success: true, message: "Booking marked as delivered." });
});

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await bookingService.getAllBookings(userId);

    return res.status(200).json({
      message: "Bookings retrieved successfully.",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving bookings." });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    const booking = await bookingService.getBookingById(bookingId, userId);

    return res.status(200).json({
      message: "Booking retrieved successfully.",
      data: booking,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    await bookingService.deleteBooking(bookingId, userId);

    return res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
