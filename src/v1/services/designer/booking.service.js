import Booking from "../../models/booking.model.js";
import ApiError from "../../../utils/apiError.js";
import UserProfile from "../../models/userProfile.model.js";
import emailUtils from "../../../utils/emailUtils.js";

const validTransitions = {
  pending: ["accepted", "rejected"],
  accepted: ["ongoing"],
  ongoing: ["paid"],
  paid: ["packaged"],
  packaged: ["out for delivery"],
  "out for delivery": ["delivered"],
  delivered: [],
  cancelled: [],
  rejected: [],
};

export const acceptBooking = async (bookingId, designerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.designerId.toString() !== designerId.toString())
    throw ApiError.unauthorized("Unauthorized action.");
  if (!validTransitions[booking.status].includes("accepted"))
    throw ApiError.forbidden("Only pending bookings can be accepted.");

  booking.status = "accepted";
  await booking.save();

  const userProfile = await UserProfile.findOne({ userId: booking.userId });
  if (userProfile) {
    await emailUtils.sendEmail({
      to: userProfile.email,
      subject: "Booking Accepted - Make Payment",
      text: `Your booking has been accepted. Please proceed with the payment. Notes: ${
        booking.notes || "None"
      }`,
    });
  }

  return booking;
};

export const declineBooking = async (bookingId, designerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.designerId.toString() !== designerId.toString())
    throw ApiError.unauthorized("Unauthorized action.");
  if (!validTransitions[booking.status].includes("rejected"))
    throw ApiError.forbidden("Only pending bookings can be rejected.");

  booking.status = "rejected";
  await booking.save();

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

export const markAsOutForDelivery = async (bookingId, designerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw ApiError.notFound("Booking not found.");
  if (booking.designerId.toString() !== designerId.toString())
    throw ApiError.unauthorized("Unauthorized action.");
  if (!validTransitions[booking.status].includes("out for delivery"))
    throw ApiError.forbidden(
      "Booking must be paid and packaged before delivery."
    );

  booking.status = "out for delivery";
  await booking.save();

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

export const getAllBookings = async (designerId) => {
  try {
    const bookings = await Booking.find({ designerId }).populate(
      "productId",
      "productName coverImage discountPrice"
    );

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const userProfile = await UserProfile.findOne({
          userId: booking.userId,
        });
        return {
          ...booking.toObject(),
          fullName: userProfile?.fullName,
          phoneNumber: userProfile?.phoneNumber,
          notes: booking.notes || "None",
        };
      })
    );

    return enrichedBookings;
  } catch (error) {
    throw ApiError.internalServerError("Error retrieving bookings.");
  }
};

export const getBookingById = async (id, designerId) => {
  const booking = await Booking.findOne({ _id: id, designerId })
    .populate("userId", "email fullName")
    .populate("productId");
  if (!booking) {
    throw ApiError.notFound("Booking not found.");
  }
  const userProfile = await UserProfile.findOne({ userId: booking.userId });
  return {
    ...booking.toObject(),
    fullName: userProfile?.fullName,
    phoneNumber: userProfile?.phoneNumber,
    notes: booking.notes || "None",
  };
};
