import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import { isAuth } from "../../middlewares/auth.js";
import {
  cancelBooking,
  confirmDelivery,
  createBooking,
  getAllBookings,
  getBookingById,
  makePayment,
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
  .route("/booking/:id/cancel")
  .post(isAuth, cancelBooking)
  .all(methodNotAllowed);
router
  .route("/booking/:id/pay")
  .post(isAuth, makePayment)
  .all(methodNotAllowed);
router
  .route("/booking/:id/confirm-delivery")
  .post(isAuth, confirmDelivery)
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
