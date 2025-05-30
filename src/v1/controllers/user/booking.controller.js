import * as bookingService from "../../services/user/booking.service.js";
import productService from "../../services/general/product.service.js";
import catchAsync from "../../../utils/catchAsync.js";

export const createBooking = catchAsync(async (req, res) => {
  const { productId, notes } = req.body;
  const product = await productService.getProductById(productId);
  const booking = await bookingService.createBooking({
    productId,
    designerId: product.designerId,
    userId: req.user.userId,
    price: product.ourPrice,
    notes,
  });
  res
    .status(201)
    .json({ success: true, message: "Booking created successfully.", booking });
});

export const cancelBooking = catchAsync(async (req, res) => {
  await bookingService.cancelBooking(req.params.id, req.user.userId);
  res.json({ success: true, message: "Booking cancelled successfully." });
});

export const makePayment = catchAsync(async (req, res) => {
  const paymentData = await bookingService.makePayment(
    req.params.id,
    req.user.userId
  );
  res.json({ success: true, message: "Payment initiated.", paymentData });
});

export const confirmDelivery = catchAsync(async (req, res) => {
  await bookingService.confirmDelivery(req.params.id, req.user.userId);
  res.json({ success: true, message: "Booking marked as delivered." });
});

export const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await bookingService.getAllBookings(req.user.userId);
  res
    .status(200)
    .json({
      success: true,
      message: "Bookings retrieved successfully.",
      data: bookings,
    });
});

export const getBookingById = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(
    req.params.bookingId,
    req.user.userId
  );
  res
    .status(200)
    .json({
      success: true,
      message: "Booking retrieved successfully.",
      data: booking,
    });
});

export const deleteBooking = catchAsync(async (req, res) => {
  await bookingService.deleteBooking(req.params.bookingId, req.user.userId);
  res
    .status(200)
    .json({ success: true, message: "Booking deleted successfully." });
});
