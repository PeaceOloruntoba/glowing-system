import * as bookingService from "../../services/user/booking.service.js";

// Create a new client
export const createBooking = async (req, res) => {
  try {
   const status = "pending"
    const userId = req.user.userId;
    const newBooking = await bookingService.createClient({
      ...req.body,
      userId,
      status,
    });

    return res
      .status(201)
      .json({ message: "Client created successfully.", data: newBooking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating client." });
  }
};

// Update an existing booking
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const updatedBooking = await bookingService.updateBooking(
      bookingId,
      updates,
      userId
    );

    return res
      .status(200)
      .json({ message: "Booking updated successfully.", data: updatedBooking });
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

    return res
      .status(200)
      .json({ message: "Bookings retrieved successfully.", data: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving bookings." });
  }
};

// Get a single booking by ID for the logged-in designer
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;
    const booking = await bookingService.getBookingById(bookingId, userId);

    return res
      .status(200)
      .json({ message: "Booking retrieved successfully.", data: booking });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error retrieving booking." });
  }
};

// Delete a client
export const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const userId = req.user.userId; // Get logged-in designer's ID
    await bookingService.deleteClient(clientId, userId);
    return res.status(200).json({ message: "Client deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error deleting client." });
  }
};
