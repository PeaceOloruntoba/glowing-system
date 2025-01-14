import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import { isAuth } from "../../middlewares/auth.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
} from "../controllers/user/booking.controller.js";

const router = express.Router();

router
  .route("/booking")
  .post(isAuth, createBooking)
  .get(isAuth, getAllBookings)
  .all(methodNotAllowed);
router
  .route("/booking/:bookingId")
  .get(isAuth, getBookingById)
  .patch(isAuth)
  .all(methodNotAllowed);

export default router;
