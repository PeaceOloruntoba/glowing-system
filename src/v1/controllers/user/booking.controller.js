import * as bookingService from "../../services/user/booking.service.js";
import Product from "../../models/product.model.js";
import ApiError from "../../../utils/apiError.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound("Product not found.");

    const newBooking = await bookingService.createBooking({
      ...req.body,
      userId,
      status: "pending",
      designerId: product.designerId,
      price: product.ourPrice,
    });

    return res.status(201).json({
      message: "Booking created successfully.",
      data: newBooking,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    const updatedBooking = await bookingService.updateBooking(
      bookingId,
      req.body,
      userId
    );

    return res.status(200).json({
      message: "Booking updated successfully.",
      data: updatedBooking,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

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
