import express from "express";
import {
  calculateShippingCost,
  bookDelivery,
  trackDelivery,
} from "../controllers/delivery.controller.js";
import { isAuth } from "../../middlewares/auth.js";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";

const router = express.Router();

router
  .route("/shipping/calculate")
  .post(isAuth, calculateShippingCost)
  .all(methodNotAllowed);
router.route("/shipping/book").post(isAuth, bookDelivery).all(methodNotAllowed);
router
  .route("/shipping/track/:orderId")
  .get(isAuth, trackDelivery)
  .all(methodNotAllowed);

export default router;
