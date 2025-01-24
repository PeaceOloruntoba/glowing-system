import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import { isAuth } from "../../middlewares/auth.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
} from "../controllers/user/booking.controller.js";
import {
  addToCart,
  decrementQuantity,
  getCart,
  incrementQuantity,
  removeFromCart,
} from "../controllers/user/cart.controller.js";

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
router
  .route("/cart")
  .get(isAuth, getCart)
  .post(isAuth, addToCart)
  .all(methodNotAllowed);
router
  .route("/cart/:productId")
  .delete(isAuth, removeFromCart)
  .all(methodNotAllowed);
router
  .route("/cart/:productId/increment")
  .patch(isAuth, incrementQuantity)
  .all(methodNotAllowed);
router
  .route("/cart/:productId/decrement")
  .patch(isAuth, decrementQuantity)
  .all(methodNotAllowed);

export default router;
