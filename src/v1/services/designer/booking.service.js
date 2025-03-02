import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";
import UserProfile from "../../models/userProfile.model.js";
import emailUtils from "../../../utils/emailUtils.js";

// Update booking
// ✅ Designer accepts booking
export const acceptBooking = async (bookingId, designerId) => {
  const booking = await Booking.findById(bookingId);
  console.log(designerId);
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.designerId.toString() !== designerId.toString())
    throw ApiError.unauthorized("Unauthorized action.");
  if (booking.status !== "pending")
    throw ApiError.forbidden("Only pending bookings can be accepted.");

  booking.status = "accepted";
  await booking.save();

  // Notify user to make payment
  const userProfile = await UserProfile.findOne({ userId: booking.userId });
  if (userProfile) {
    await emailUtils.sendEmail({
      to: userProfile.email,
      subject: "Booking Accepted - Make Payment",
      text: `Your booking has been accepted. Please proceed with the payment.`,
    });
  }

  return booking;
};

// ✅ Designer declines booking
export const declineBooking = async (bookingId, designerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.designerId.toString() !== designerId.toString())
    throw ApiError.unauthorized("Unauthorized action.");

  booking.status = "rejected";
  await booking.save();

  // Notify user
  const userProfile = await UserProfile.findOne({ userId: booking.userId });
  if (userProfile) {
    await emailUtils.sendEmail({
      to: userProfile.email,
      subject: "Booking Declined",
      text: `Unfortunately, the designer has declined your booking.`,
    });
  }

  return booking;
};

// ✅ Designer updates booking status to "out for delivery"
export const markAsOutForDelivery = async (bookingId, designerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.designerId.toString() !== designerId.toString())
    throw ApiError.unauthorized("Unauthorized action.");
  if (booking.status !== "paid")
    throw ApiError.forbidden("Booking must be paid before delivery.");

  booking.status = "out for delivery";
  await booking.save();

  // Notify user
  const userProfile = await UserProfile.findOne({ userId: booking.userId });
  if (userProfile) {
    await emailUtils.sendEmail({
      to: userProfile.email,
      subject: "Booking is Out for Delivery",
      text: `Your booking is now out for delivery.`,
    });
  }

  return booking;
};

// Get all bookings for a specific designer
export const getAllBookings = async (designerId) => {
  try {
    // Fetch all bookings for the given designer
    const bookings = await Booking.find({ designerId }).populate(
      "productId",
      "productName coverImage discountPrice"
    );

    // Map over bookings to fetch additional user details
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const userProfile = await UserProfile.findOne({
          userId: booking.userId,
        });

        // Ensure userProfile exists before destructuring
        const { fullName, phoneNumber } = userProfile || {};
        return {
          ...booking.toObject(), // Spread booking details
          fullName,
          phoneNumber,
        };
      })
    );

    return enrichedBookings;
  } catch (error) {
    console.error(error);
    throw ApiError.internalServerError("Error retrieving bookings.");
  }
};

// Get a single booking by ID for a specific designer
export const getBookingById = async (id, designerId) => {
  const booking = await Booking.findOne({ _id: id, designerId })
    .populate("userId", "email fullName")
    .populate("productId");
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  return booking;
};
