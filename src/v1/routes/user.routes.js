import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import { isAuth } from "../../middlewares/auth.js";
import { createBooking } from "../controllers/user/booking.controller.js";

const router = express.Router();

router
  .route("/booking")
  .post(isAuth, createBooking)
  .get(isAuth, )
  .all(methodNotAllowed);
router
  .route("/booking/:bookingId")
  .get(isAuth, checkDesignerRegistration)
  .patch(isAuth, checkDesignerRegistration)
  .all(methodNotAllowed);

export default router;
