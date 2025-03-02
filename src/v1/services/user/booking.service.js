import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";
import UserProfile from "../../models/userProfile.model.js";
import processPaystackPayment from "../../../utils/paystackPayment.js"; // New Paystack function
import emailUtils from "../../../utils/emailUtils.js";
import authService from "../auth.service.js";
import DesignerProfile from "../../models/designerProfile.model.js";

// ✅ Validate and fetch booking (used for updates)
const validateBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId)
    .populate("productId")
    .populate("designerId");
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.userId.toString() !== userId.toString())
    throw ApiError.unauthorized("Unauthorized to modify this booking.");
  return booking;
};

// ✅ Create a new booking (User initiates)
export const createBooking = async (data) => {
  const booking = new Booking({ ...data, status: "pending" });
  await booking.save();

  // Notify designer about a new booking
  const designerProfile = await UserProfile.findOne({
    userId: booking.designerId,
  });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "New Booking Request",
      text: `A new booking has been placed. Review and accept it.`,
    });
  }

  return booking;
};

// ✅ User cancels booking before payment
export const cancelBooking = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  if (booking.status !== "pending")
    throw ApiError.forbidden("Cannot cancel a booking after it's accepted.");

  booking.status = "cancelled";
  await booking.save();

  // Notify designer
  const designerProfile = await UserProfile.findOne({
    userId: booking.designerId,
  });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "Booking Cancelled",
      text: `The user has cancelled their booking.`,
    });
  }

  return booking;
};

// ✅ User makes payment via Paystack
export const makePayment = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  if (booking.status !== "accepted")
    throw ApiError.forbidden("Payment can only be made for accepted bookings.");
  const user = await authService.getUser(userId);
  // Process payment
  console.log(booking.price);
  const paymentResponse = await processPaystackPayment({
    email: user.data.user.email,
    reference: bookingId,
    amount: booking.price,
  });

  booking.status = "paid";
  await booking.save();

  // Notify designer & user
  const designerProfile = await UserProfile.findOne({
    userId: booking.designerId,
  });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "Payment Received",
      text: `The user has successfully made a payment for their booking.`,
    });
  }

  return { booking, paymentResponse };
};

// ✅ Confirm delivery (User approves final stage)
export const confirmDelivery = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  if (booking.status !== "out for delivery")
    throw ApiError.forbidden("Booking must be out for delivery first.");

  booking.status = "delivered";
  await booking.save();

  // Notify designer
  const designerProfile = await UserProfile.findOne({
    userId: booking.designerId,
  });
  if (designerProfile) {
    await emailUtils.sendEmail({
      to: designerProfile.email,
      subject: "Booking Delivered",
      text: `The user has confirmed that the booking is delivered.`,
    });
  }

  return booking;
};

// Fetch all bookings for a user
export const getAllBookings = async (designerId) => {
  try {
    // Fetch all bookings for the given designer
    const bookings = await Booking.find({ designerId }).populate(
      "productId",
      "productName coverImage ourPrice"
    );

    // Map over bookings to fetch additional user details
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const designerProfile = await DesignerProfile.findOne({
          userId: booking.userId,
        });

        // Ensure designerProfile exists before destructuring
        const { businessName, state, businessAddress } = designerProfile || {};
        return {
          ...booking.toObject(), // Spread booking details
          businessName,
          state,
          businessAddress,
        };
      })
    );

    return enrichedBookings;
  } catch (error) {
    console.error(error);
    throw ApiError.internalServerError("Error retrieving bookings.");
  }
};

// Get a single booking by ID for a specific user
export const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId })
    .populate("designerId")
    .populate("productId");
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  const enrichedBooking = await Promise(async (booking) => {
    const designerProfile = await DesignerProfile.findOne({
      userId: booking.userId,
    });

    // Ensure designerProfile exists before destructuring
    const { businessName, state, businessAddress } = designerProfile || {};
    return {
      ...booking.toObject(), // Spread booking details
      businessName,
      state,
      businessAddress,
    };
  });

  return enrichedBooking;
};

// Delete a booking
export const deleteBooking = async (bookingId, userId) => {
  const booking = await validateBooking(bookingId, userId);
  return await Booking.findByIdAndDelete(booking._id);
};
